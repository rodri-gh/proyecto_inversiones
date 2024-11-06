import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import { WithdrawalRequest } from '../models/mainExport.js';
import { verifyIfIdExists } from '../helpers/handleId.js';


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
    const withdrawalRequests = await WithdrawalRequest.findAll();
    getHandleSuccess(200)(res, withdrawalRequests);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const withdrawalRequest = await WithdrawalRequest.findOne({ where: { id } });  
    verifyIfIdExists(withdrawalRequest);
    getHandleSuccess(200)(res, withdrawalRequest);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.get('/user/:id', async function (req, res, next) {
  const { id } = req.params;
  try {
    const withdrawalRequests = await WithdrawalRequest.findAll({ where: { user_id: id } });
    res.status(200).json({
      data: withdrawalRequests,
      message: 'Withdrawal request details'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: 'Error in the query'
    });
  }
});

router.post('/', upload.fields([{ name: 'photo_document' }, { name: 'selfie_photo' }]), async function (req, res, next) {
  const { investment_id, user_id, request_amount, commission_apply, receive_amount, status } = req.body;
  const photo_document = req.files['photo_document'] ? req.files['photo_document'][0].filename : null;
  const selfie_photo = req.files['selfie_photo'] ? req.files['selfie_photo'][0].filename : null;
  const projectStatus = status || 'pending';

  try {
    const newRequest = await WithdrawalRequest.create({
      investment_id,
      user_id,
      requestAmount: request_amount,
      commissionApply: commission_apply,
      receiveAmount: receive_amount,
      photoDocument: photo_document,
      selfiePhoto: selfie_photo,
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
