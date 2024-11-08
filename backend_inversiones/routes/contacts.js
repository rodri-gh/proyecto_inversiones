import express from 'express';
import { getHandleError } from '../helpers/handleExceptions.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import Contact from '../models/contactModel.js';
import { verifyIfIdExists } from '../helpers/handleId.js';


const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contact.findAll();
    getHandleSuccess(200)(res, contacts)
  } catch (error) {
    getHandleError(error, res)
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findOne({ where: { id } });
    verifyIfIdExists(contact);
    getHandleSuccess(200)(res, contact)
  } catch (error) {
    getHandleError(error, res)
  }
});

router.post('/', async (req, res, next) => {
  //TODO: verify if we can create a repeat contact
  const { name, lastName, email, phone, comment, answer } = req.body;
  try {
    await Contact.create({ name, lastName, email, phone, comment, answer });
    getHandleSuccess(201)(res, "Contact created successfully")
  } catch (error) {
    getHandleError(error, res)
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name, lastName, email, phone, comment, answer } = req.body;
  try {
    const [updatedContact] = await Contact.update({ name, lastName, email, phone, comment, answer }, {
      where: { id },
      returning: true
    });
    verifyIfIdExists(updatedContact);
    getHandleSuccess(204)(res);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.patch('/:id', async function (req, res, next) {
  const { id } = req.params;
  const { answer } = req.body;
  try {
    const [updatedContact] = await Contact.update({ answer }, {
      where: { id },
      returning: true
    });
    verifyIfIdExists(updatedContact);
    getHandleSuccess(204)(res);
  } catch (error) {
    getHandleError(error, res);
  }
}
);

router.delete('/:id', async function (req, res, next) {
  const { id } = req.params;
  try {
    const [updatedContact] = await Contact.update({ deleted: 1 }, {
      where: { id },
      returning: true
    });
    verifyIfIdExists(updatedContact);
    getHandleSuccess(204)(res);
  } catch (error) {
    getHandleError(error, res);
  }
});

export default router;
