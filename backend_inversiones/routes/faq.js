import express from 'express';
import { getHandleError } from '../helpers/handleExceptions.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { Faq } from '../models/mainExport.js';
import { verifyIfIdExists } from '../helpers/handleId.js';


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
    const { ask, answer, status } = req.body;
    try {
        const faqs = await Faq.create({ask, answer, status});
        getHandleSuccess(201)(res, "Faq created successfully");
    } catch (error) {
        getHandleError(error, res)
    }
});

router.put('/:id', async (req, res, next) =>{
    const { id } = req.params;
    const { ask, answer, status } = req.body;
    try {
        const faqs = await Faq.update({ask, answer, status}, { where: { id } });
        getHandleSuccess(200)(res);
    } catch (error) {
        getHandleError(error, res)
    }
});


router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const [faqDeleted] = await Faq.update({ status: true }, { where: { id } });
        verifyIfIdExists(faqDeleted);
        getHandleSuccess(200)(res);
    } catch (error) {
        getHandleError(error, res)
    }
});

export default router;
