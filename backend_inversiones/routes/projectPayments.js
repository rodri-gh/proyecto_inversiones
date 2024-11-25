import express from 'express';
import { getHandleError } from '../helpers/handleExceptions.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { ProjectPayment } from '../models/mainExport.js';
import { verifyIfIdExists } from '../helpers/handleId.js';

// falta arregal este router porque es copiado de investments

const router = express.Router();
router.get('/', async (req, res, next) => {
  try {
    const investments = await ProjectPayment.findAll();
    getHandleSuccess(200)(res, investments);
  } catch (error) {
    getHandleError(error, res)
  }
});


router.get('/project/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const investments = await ProjectPayment.findAll({
      where: { projectId: id }
    });
    getHandleSuccess(200)(res, investments);
  } catch (error) {
    getHandleError(error, res)
  }
})

router.get('/pending/user/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const investments = await ProjectPayment.findAll({
      where: { userId: id, status: "pending" }
    });
    getHandleSuccess(200)(res, investments);
  } catch (error) {
    getHandleError(error, res)
  }
})

router.post('/', async (req, res, next) => {
  const { projectId, userId, amount, profitPercentage } = req.body;
  try {
    await ProjectPayment.create({ projectId, userId, amount, profitPercentage });
    getHandleSuccess(201)(res, "Investment created successfully");
  } catch (error) {
    getHandleError(error, res)
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { projectId, userId, amount, profitPercentage } = req.body;
  try {
    const [updatedCount] = await ProjectPayment.update({ projectId, userId, amount, profitPercentage }, {
      where: { id },
    });
    verifyIfIdExists(updatedCount);
    getHandleSuccess(204)(res);
  } catch (error) {
    getHandleError(error, res)
  }
});

export default router;
