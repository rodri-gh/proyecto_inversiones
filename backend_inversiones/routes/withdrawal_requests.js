import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import { WithdrawalRequest, Project } from '../models/mainExport.js';
import { verifyIfIdExists } from '../helpers/handleId.js';
import dotenv from 'dotenv';

dotenv.config();


const router = express.Router();
const uploadDir = 'public/images/withdrawalRequests';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.get('/', async (req, res, next) => {
  try {
    const withdrawalRequests = await WithdrawalRequest.findAll({
      include: [
        {
          association: 'user',
          attributes: ['id', 'name', 'lastName', 'email']
        },
        {
          association: 'investment',
          include: [{
            model: Project,
            attributes: ['id', 'name', 'status', 'investmentGoal']
          }]
        }
      ]
    });

    withdrawalRequests.forEach(withdrawal => {
      const url = process.env.URL_BASE;
      if (withdrawal.selfiePhoto) {
        const selfiePhoto = withdrawal.selfiePhoto;
        withdrawal.selfiePhoto = url + '/images/withdrawalRequests/' + selfiePhoto;
        console.log(withdrawal.selfiePhoto);
      }
      if (withdrawal.photoDocument) {
        const photoDocument = withdrawal.photoDocument;
        withdrawal.photoDocument = url + '/images/withdrawalRequests/' + photoDocument;
        console.log(withdrawal.photoDocument);
      }
    });

    getHandleSuccess(200)(res, withdrawalRequests);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.get('/pending', async (req, res, next) => {
  try {
    const withdrawalRequests = await WithdrawalRequest.findAll({ where: { status: 'pending' } });
    getHandleSuccess(200)(res, withdrawalRequests);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.patch('/status/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const withdrawalRequest = await WithdrawalRequest.findByPk(id);

    if (!withdrawalRequest) {
      return res.status(404).json({
        message: 'Withdrawal request not found'
      });
    }

    const updateData = {
      status,
      approvalDate: null
    };

    if (status === 'approved') {
      updateData.approvalDate = new Date();
    }

    await WithdrawalRequest.update(updateData, {
      where: { id: id }
    });

    const updatedRequest = await WithdrawalRequest.findByPk(id);

    return res.status(200).json({
      message: 'Withdrawal request status updated successfully',
      data: updatedRequest
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
      message: 'Error updating withdrawal request status'
    });
  }
});

// En withdrawal_requests.js
router.get('/user/:id', async function (req, res, next) {
  const { id } = req.params;
  try {
    const withdrawalRequests = await WithdrawalRequest.findAll({
      where: { user_id: id },
      include: [
        {
          association: 'user',

        },
        {
          association: 'investment',
          include: [{
            model: Project,

          }]
        }
      ]
    });

    const response = {
      success: true,
      data: withdrawalRequests || [],
      message: 'Withdrawal requests retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.post('/', upload.fields([{ name: 'photoDocument' }, { name: 'selfiePhoto' }]), async function (req, res, next) {
  const { investmentId, userId, requestAmount, commissionApply, receiveAmount, status } = req.body;
  const photoDocument = req.files['photoDocument'] ? req.files['photoDocument'][0].filename : null;
  const selfiePhoto = req.files['selfiePhoto'] ? req.files['selfiePhoto'][0].filename : null;
  const projectStatus = status || 'pending';

  try {
    const newRequest = await WithdrawalRequest.create({
      investmentId: investmentId,
      userId: userId,
      requestAmount: requestAmount,
      commissionApply: commissionApply,
      receiveAmount: receiveAmount,
      photoDocument: photoDocument,
      selfiePhoto: selfiePhoto,
      status: projectStatus
    });
    res.status(201).json({
      data: newRequest,
      message: 'Withdrawal request created successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: 'Error in the query'
    });
  }
});


router.put('/:id', upload.fields([{ name: 'photo_document' }, { name: 'selfie_photo' }]), async function (req, res, next) {
  const { id } = req.params;
  const { investment_id, user_id, request_amount, commission_apply, receive_amount, status } = req.body;

  try {
    const currentRequest = await WithdrawalRequest.findByPk(id);
    if (!currentRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    let photo_document = currentRequest.photoDocument;
    let selfie_photo = currentRequest.selfiePhoto;

    if (req.files['photo_document']) {
      photo_document = req.files['photo_document'][0].filename;
      if (currentRequest.photoDocument) {
        fs.unlinkSync(`${uploadDir}/${currentRequest.photoDocument}`);
      }
    }

    if (req.files['selfie_photo']) {
      selfie_photo = req.files['selfie_photo'][0].filename;
      if (currentRequest.selfiePhoto) {
        fs.unlinkSync(`${uploadDir}/${currentRequest.selfiePhoto}`);
      }
    }

    await WithdrawalRequest.update(
      {
        investment_id,
        user_id,
        requestAmount: request_amount,
        commissionApply: commission_apply,
        receiveAmount: receive_amount,
        photoDocument: photo_document,
        selfiePhoto: selfie_photo,
        status
      },
      { where: { withdrawalRequestId: id } }
    );

    res.status(200).json({
      message: 'Withdrawal request successfully updated'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: 'Error in the query'
    });
  }
});

router.patch('/status/:id', async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const [withdrawalRequestCount] = await WithdrawalRequest.update({ deleted: true }, {
      where: { id }
    });
    verifyIfIdExists(withdrawalRequestCount);
    getHandleSuccess(204)(res);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const [withdrawalRequestDeleted] = await WithdrawalRequest.update({ deleted: true }, { where: { id } });
    verifyIfIdExists(withdrawalRequestDeleted);
    getHandleSuccess(204)(res);
  } catch (error) {
    getHandleError(error, res);
  }
});

export default router;