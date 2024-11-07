import express from 'express';
import { getHandleError } from '../helpers/handleExceptions.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { Faq } from '../models/mainExport.js';
import { verifyIfIdExists } from '../helpers/handleId.js';
import { created } from '../helpers/customMessage.js';


const router = express.Router();
router.get('/', async (req, res, next) => {
  try {
    const faqs = await Faq.findAll();
    getHandleSuccess(200)(res, faqs);
  } catch (error) {
    getHandleError(error, res)
  }
});


router.post('/', async (req, res, next) => {
  const { ask, answer } = req.body;
  try {
    const faqs = await Faq.create({ ask, answer });
    getHandleSuccess(201)(res, created.faq);
  } catch (error) {
    getHandleError(error, res)
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { ask, answer } = req.body;
  try {
    const faqs = await Faq.update({ ask, answer }, { where: { id } });
    getHandleSuccess(204)(res);
  } catch (error) {
    getHandleError(error, res)
  }
});


router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const faq = await Faq.findOne({ where: { id } });
    if (!faq) {
      return getHandleError(new Error('Faq not found'), res);
    }

    const newDeletedStatus = faq.deleted ? 0 : 1;
    await Faq.update({ deleted: newDeletedStatus }, { where: { id } });

    getHandleSuccess(200)(res, `Faq ${newDeletedStatus ? 'deleted' : 'restored'} successfully`);
  } catch (error) {
    getHandleError(error, res)
  }
});

export default router;
