import express from 'express';
import { encrypt } from '../helpers/handleBcrypt.js';
import { User, Account } from '../models/mainExport.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import sequelize from '../database/connection.js';
import { verifyIfIdExists } from '../helpers/handleId.js';
import { created } from '../helpers/customMessage.js';
import sendEmail from '../services/emailService.js';

const router = express.Router();
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Account,
        attributes: ['username', 'password']
      }]
    });
    getHandleSuccess(200)(res, users);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: { id },
      include: [{
        model: Account,
        attributes: ['username', 'password']
      }
      ]
    });
    verifyIfIdExists(user);
    getHandleSuccess(200)(res, user);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.post('/', async (req, res, next) => {
  const { email, phone, role, name, lastName, documentNumber } = req.body;



  if (!email || !phone || !role || !name || !lastName || !documentNumber) {
    return res.status(400).json({ message: 'All fields are required ' });
  }


  const transaction = await sequelize.transaction();
  try {
    const newUser = await User.create({ email, phone, role: role, name, lastName, documentNumber }, {
      transaction
    });
    const firstName = name.split(' ')[0];
    const username = documentNumber;
    const password = `${firstName.charAt(0).toUpperCase() + firstName.slice(1)}.${documentNumber}`;
    const passwordHash = await encrypt(password);

    sendEmail(email, { username, password, name });
    await Account.create({ userId: newUser.id, username, password: passwordHash }, {
      transaction
    });
    await transaction.commit();
    getHandleSuccess(201)(res, created.user);
  } catch (error) {
    await transaction.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Ya existe un usuario con esos datos' });
    }
    getHandleError(error, res);
  }
});

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { email, phone, name, lastName, role, documentNumber } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const [updatedUserCount] = await User.update({ email, phone, name, lastName, role, documentNumber }, {
      where: { id },
      returning: true,
      transaction
    });
    verifyIfIdExists(updatedUserCount);
    await transaction.commit();
    getHandleSuccess(204)(res);
  } catch (error) {
    await transaction.rollback();
    getHandleError(error, res);
  }
});


router.put('/update/:id', async (req, res, next) => {
  const { id } = req.params;
  const { phone, password } = req.body;
  const transaction = await sequelize.transaction();
  try {
    const [updatedUserCount] = await User.update({ phone }, {
      where: { id },
      returning: true,
      transaction
    });

    if (!password) {
      await transaction.commit();
      getHandleSuccess(204)(res);
      return;
    }

    verifyIfIdExists(updatedUserCount);
    const passwordHash = await encrypt(password);
    const [updatedAccountCount] = await Account.update({ password: passwordHash }, {
      where: { userId: id },
      returning: true,
      transaction
    });
    verifyIfIdExists(updatedAccountCount);
    await transaction.commit();
    getHandleSuccess(204)(res);
  } catch (error) {
    await transaction.rollback();
    getHandleError(error, res);
  }
});

router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return getHandleError(new Error('User not found'), res);
    }

    const newDeletedStatus = user.deleted ? 0 : 1;
    await User.update({ deleted: newDeletedStatus }, { where: { id } });

    getHandleSuccess(200)(res, `User ${newDeletedStatus ? 'deleted' : 'restored'} successfully`);
  } catch (error) {
    getHandleError(error, res);
  }
});

export default router;
