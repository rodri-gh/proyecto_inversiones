import express from 'express';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import Contract from '../models/contractModel.js';
import { verifyIfIdExists } from '../helpers/handleId.js';
import Investment from '../models/investmentModel.js';


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


router.post('/', async (req, res, next) => {
    const { projectId, userId, investmentAmount,
         contractCode, startDate, endDate, status, contractType,
         currency, contractFilePath } = req.body;
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

router.put('/:id', async(req, res, next) => {
    const { id } = req.params;
    const { projectId, userId, investmentId, contractCode, contractDate, contractFilePath } = req.body;
    try {
        const [updatedCount] = await Contract.update({ projectId, userId, investmentId, contractCode, contractDate, contractFilePath }, {
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
