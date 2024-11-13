import express from 'express';
import { getHandleError } from '../helpers/handleExceptions.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { Investment, User } from '../models/mainExport.js';
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

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const investment = await Investment.findOne({ where: { id } });
    getHandleSuccess(200)(res, investment);
  } catch (error) {
    getHandleError(error, res)
  }
});

router.get('/user/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const investment = await Investment.findAll({ where: { userId: id } });
    getHandleSuccess(200)(res, investment);
  } catch (error) {
    getHandleError(error, res)
  }
})

router.get('/project/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const investments = await Investment.findAll({
      where: { projectId: id },
      include: [{
        model: User,
        attributes: ['name'],
        as: 'user'
      }]
    });
    getHandleSuccess(200)(res, investments);
  } catch (error) {
    getHandleError(error, res)
  }
})

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
  const { projectId, userId, amount, profitPercentage } = req.body;
  try {
    const [updatedCount] = await Investment.update({ projectId, userId, amount, profitPercentage }, {
      where: { id },
    });
    verifyIfIdExists(updatedCount);
    getHandleSuccess(204)(res);
  } catch (error) {
    getHandleError(error, res)
  }
});

export default router;
