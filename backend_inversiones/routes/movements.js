import express from 'express';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import { Movement } from '../models/mainExport.js';
import { verifyIfIdExists } from '../helpers/handleId.js';


const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const movements = await Movement.findAll();
        getHandleSuccess(200)(res, movements);
    } catch (error) {
        getHandleError(error, res)
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const movement = await Movement.findOne({ where: { id } });
        verifyIfIdExists(movement);
        getHandleSuccess(200)(res, movement);
    } catch (error) {
        getHandleError(error, res)
    }
});

router.post('/', async (req, res) => {
    //TODO: state?
    const { userId, description, type, amount, requestDate, state } = req.body;
    try {
        await Movement.create({ userId, description, type, amount, requestDate, state });
        getHandleSuccess(201)(res, "Movement created successfully");
    } catch (error) {
        getHandleError(error, res)
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { description, type, amount, requestDate, disbursementDate, state } = req.body;
    try {
        const [movementCount] = await Movement.update({ description, type, amount, requestDate, disbursementDate, state }, {
            where: { id },
        });
        verifyIfIdExists(movementCount);
        getHandleSuccess(204)(res);
    } catch (error) {
        getHandleError(error, res)
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [movementCount] = await Movement.destroy({
            where: { id },
        });
        verifyIfIdExists(movementCount);
        getHandleSuccess(204)(res);
    } catch (error) {
        getHandleError(error, res)
    }
});

export default router;
