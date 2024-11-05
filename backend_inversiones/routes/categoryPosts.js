import express from 'express';
import { getHandleError } from '../helpers/handleExceptions.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { CategoryPost } from '../models/mainExport.js';
import { verifyIfIdExists } from '../helpers/handleId.js';
import { created } from '../helpers/customMessage.js';


const router = express.Router();
router.get('/', async (req, res, next) => {
  try {
    const categoryPosts = await CategoryPost.findAll();
    getHandleSuccess(200)(res, categoryPosts)
  } catch (error) {
    getHandleError(error, res)
  }
});


router.post('/', async (req, res, next) => {
  const { name } = req.body;
  try {
    await CategoryPost.create({ name });
    getHandleSuccess(201)(res, created.categoryPost)
  } catch (error) {
    getHandleError(error, res)
  }
});


router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const [updatedCount] = await CategoryPost.update({ name }, {
      where: { id },
      returning: true
    });
    verifyIfIdExists(updatedCount);
    getHandleSuccess(204)(res)
  } catch (error) {
    getHandleError(error, res)
  }
});

router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const [updatedCount] = await CategoryPost.update({ deleted: 1 }, {
      where: { id },
      returning: true
    });
    verifyIfIdExists(updatedCount);
    getHandleSuccess(204)(res)
  } catch (error) {
    getHandleError(error, res)
  }
});

export default router;
