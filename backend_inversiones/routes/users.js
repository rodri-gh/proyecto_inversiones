import express from 'express';
import { encrypt } from '../helpers/handleBcrypt.js';
import { User, Account } from '../models/mainExport.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import sequelize from '../database/connection.js';
import { verifyIfIdExists } from '../helpers/handleId.js';
import { created } from '../helpers/customMessage.js';

var lastInsertedId = null;

router.get('/', validateToken, (req, res, next) => {
    const query = `SELECT u.id, u.email, u.phone, u.role, u.name, u.last_name, u.deleted, a.username
                    FROM users u LEFT
                    JOIN account a ON u.id = a.user_id;`;
    connection.query(query, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(500).json({
                error: error,
                message: 'Error in the query'
            });
        } else {
            console.log(results);
            res.status(200).json({
                data: results,
                message: 'List of users'
            });
        }
    });
});

router.get('/:id', validateToken, (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const query = `SELECT * FROM users WHERE id = ?`;
    connection.query(query, [id], (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(500).json({
                error: error,
                message: 'Error in the query'
            });
        } else {
            console.log(results);
            res.status(200).json({
                data: results,
                message: 'List of users'
            });
        }
    });
});

router.post('/', validateToken, async (req, res) => {
    const { email, phone, role, name, lastName, username, password } = req.body;

    const userQuery = `INSERT INTO users (email, phone, role, name, last_name) VALUES ("${email}", "${phone}", "${role}", "${name}", "${lastName}");`;

    console.log("query", userQuery);

    connection.query(userQuery, async (error, results) => {
        console.log("id", results);
        if (error) {
            console.log(error);
            res.status(500).json({
                error: error,
                message: 'Error in the query',
            });
        }
        console.log(results);
        lastInsertedId = results.insertId;
        const passwordHash = await encrypt(password);
        const accountQuery = `INSERT INTO account (user_id, username, password) VALUES (${lastInsertedId}, "${username}", "${passwordHash}");`;
        connection.query(accountQuery, (error) => {
            if (error) {
                console.log(error);
                res.status(500).json({
                    error: error,
                    message: 'Error in the query',
                });
            }
            sendEmail(email, { username, password, name });
            res.status(200).json({
                message: 'Created account',
            });
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
