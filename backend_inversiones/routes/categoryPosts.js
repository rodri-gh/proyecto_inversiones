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

  if (!name) {
    return res.status(400).json({
      error: true,
      message: 'Name is required'
    });
  }

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

  if (!name) {
    return res.status(400).json({
      error: true,
      message: 'Name is required'
    });
  }



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
    const categoryPost = await CategoryPost.findOne({ where: { id } });
    if (!categoryPost) {
      return getHandleError(new Error('CategoryPost not found'), res);
    }

    const newDeletedStatus = categoryPost.deleted ? 0 : 1;
    await categoryPost.update({ deleted: newDeletedStatus }, { where: { id } });

    getHandleSuccess(200)(res, `CategoryPost ${newDeletedStatus ? 'deleted' : 'restored'} successfully`);
  } catch (error) {
    getHandleError(error, res)
  }
});

export default router;
