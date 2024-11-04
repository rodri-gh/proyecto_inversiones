import express from 'express';
import { getHandleError } from '../helpers/handleExceptions.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { Investment } from '../models/mainExport.js';
import { verifyIfIdExists } from '../helpers/handleId.js';


const router = express.Router();
router.get('/', async (req, res, next) => {
    try {
        const investments = await Investment.findAll();
        getHandleSuccess(200)(res, investments);
    } catch (error) {
        getHandleError(error, res)
    }
});

router.post('/', async (req, res, next) => {
    const { projectId, userId, amount, profitPercentage } = req.body;
    try {
        await Investment.create({ projectId, userId, amount, profitPercentage });
        getHandleSuccess(201)(res, "Investment created successfully");
    } catch (error) {
        getHandleError(error, res)
    }
});

router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const {projectId, userId, amount, profitPercentage } = req.body;
    try {
        const [updatedCount] =await Investment.update({ projectId, userId, amount, profitPercentage }, {
            where: { id },
        });
        verifyIfIdExists(updatedCount);
        getHandleSuccess(204)(res);
    } catch (error) {
        getHandleError(error, res)
    }
});

export default router;
