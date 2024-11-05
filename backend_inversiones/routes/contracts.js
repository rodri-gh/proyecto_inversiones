import express from 'express';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import Contract from '../models/contractModel.js';
import { verifyIfIdExists } from '../helpers/handleId.js';


const router = express.Router();
router.get('/', async (req, res, next) => {
    try { const contracts = await Contract.findAll();
        getHandleSuccess(200)()(res, contracts)
    } catch (error) {
        getHandleError(error, res)
    }
});

router.post('/', async (req, res, next) => {
    const { projectId, userId, investmentId, contractCode, contractDate, contractFilePath } = req.body;
    try {
        await Contract.create({ projectId, userId, investmentId, contractCode, contractDate, contractFilePath });
        getHandleSuccess(201)()(res, "Contract created successfully")
    } catch (error) {
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
        getHandleSuccess(204)()(res)
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
        getHandleSuccess(204)()(res)
    } catch (error) {
        getHandleError(error, res)
    }
});

export default router;
