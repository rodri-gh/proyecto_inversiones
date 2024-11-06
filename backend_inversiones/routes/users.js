import express from 'express';
import { encrypt } from '../helpers/handleBcrypt.js';
import { User, Account } from '../models/mainExport.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import sequelize from '../database/connection.js';
import { verifyIfIdExists } from '../helpers/handleId.js';
import { created } from '../helpers/customMessage.js';

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
            }]
        });
        verifyIfIdExists(user);
        getHandleSuccess(200)(res, user);
    } catch (error) {
        getHandleError(error, res);
    }
});

router.post('/', async (req, res, next) => {
    const { email, phone, name, lastName, username, password } = req.body;
    const transaction = await sequelize.transaction();
    try {
        const newUser = await User.create({ email, phone, role: 'client', name, lastName }, {
            transaction
        })
        const passwordHash = await encrypt(password);
        await Account.create({ userId: newUser.id, username, password: passwordHash }, {
            transaction
        })
        await transaction.commit();
        getHandleSuccess(201)(res, created.user);
    } catch (error) {
        transaction.rollback();
        getHandleError(error, res);
    }
});

router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { email, phone, name, lastName, username, password } = req.body;
    const transaction = await sequelize.transaction();

    try {
        const [updatedUserCount] = await User.update({ email, phone, name, lastName }, {
            where: { id },
            returning: true,
            transaction
        });
        verifyIfIdExists(updatedUserCount);
        const passwordHash = await encrypt(password);
        const [updatedAccountCount] = await Account.update({ username, password: passwordHash }, {
            where: { userId: id },
            returning: true,
            transaction
        }
        );
        verifyIfIdExists(updatedAccountCount);
        await transaction.commit();
        getHandleSuccess(204)(res);
    } catch (error) {
        await transaction.rollback();
        getHandleError(error, res);
    }
});

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const [userDeleted] = await User.update({ deleted: true }, { where: { id } });
        verifyIfIdExists(userDeleted);
        getHandleSuccess(204)(res);
    } catch (error) {
        getHandleError(error, res)
    }
});

export default router;
