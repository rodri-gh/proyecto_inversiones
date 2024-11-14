import express from 'express';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import Contract from '../models/contractModel.js';
import { verifyIfIdExists } from '../helpers/handleId.js';
import Investment from '../models/investmentModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


const uploadDir = 'public/contratos';
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
  const allowedTypes = ['application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
  } else {
      cb(new Error('Invalid file type. Only PDF is allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
      fileSize: 5 * 1024 * 1024 
  }
});

const router = express.Router();
router.get('/', async (req, res, next) => {
    try { 
        const contracts = await Contract.findAll();
        getHandleSuccess(200)(res, contracts);
    } catch (error) {
        console.log(error)
        getHandleError(error, res)
    }
});

router.get('/project/:id', async (req, res, next) => {
    const { id } = req.params;
    try { 
        const contracts = await Contract.findAll({
            where: { projectId: id }
        });
        getHandleSuccess(200)(res, contracts);
    } catch (error) {
        console.log(error)
        getHandleError(error, res)
    }
});


router.post('/', upload.fields([{ name: 'contractFilePath'}]), async (req, res, next) => {
    console.log('req.files:', req.files);
    const { projectId, userId, investmentAmount,
         contractCode, startDate, endDate, status, contractType,
         currency } = req.body;

         const contractFile = req.files['contractFilePath']?.[0];
         const contractFilePath = contractFile ? contractFile.path : null;
    try {
        const contract = await Contract.create({ projectId, userId,
             investmentAmount, contractCode, startDate, endDate,
              status, contractType, currency, contractFilePath });

        await Investment.create({ contractId: contract.id, 
            projectId: projectId, userId: userId, 
            amount: investmentAmount,
            investmentDate: startDate, 
            //profit_percentage,
            currency: currency, status: status
        })
        getHandleSuccess(201)(res, "Contract and associated investment created successfully")
    } catch (error) {
        console.error(error);
        getHandleError(error, res)
    }
});

router.put('/:id', upload.fields([{ name: 'contractFilePath', maxCount:1 }]), async(req, res, next) => {
    const { id } = req.params;
    const { projectId, userId, investmentId, investmentAmount, contractCode, contractDate, contractFilePath } = req.body;
    try {
        const currentContract = await Contract.findByPk(id);
        if (!currentContract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        let contractFilePath = currentContract.contractFilePath;

        if (req.files['contractFilePath']) {
            const newContractFile = req.files['contractFilePath'][0];
            contractFilePath = newContractFile.filename;

            if (currentContract.contractFilePath) {
                const oldFilePath = path.join(uploadDir, currentContract.contractFilePath);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
        }

        const [updatedCount] = await Contract.update({ 
            projectId, userId, investmentId, 
            investmentAmount, contractCode, contractDate,
             contractFilePath }, {
            where: { id },
            returning: true
        });
        verifyIfIdExists(updatedCount);
        getHandleSuccess(204)(res)
    } catch (error) {
        getHandleError(error, res)
    }
});

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const [updatedCount] = await Contract.update({ deleted: 1 }, {
            where: { id }
        });
        verifyIfIdExists(updatedCount);
        getHandleSuccess(204)(res)
    } catch (error) {
        getHandleError(error, res)
    }
});

export default router;
