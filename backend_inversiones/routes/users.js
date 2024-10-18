var express = require('express');
var router = express.Router();
const { encrypt } = require('../helpers/handleBcrypt');
var connection = require('../database');
const { validateToken } = require('./auth')



var lastInsertedId = null;

router.get('/', validateToken, (req, res, next) => {
    const query = 'SELECT * FROM users;';
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

router.post('/', validateToken, async (req, res) => {
    const { email, cellphone, name, lastname, username, password } = req.body;

    const userQuery = `
    INSERT INTO users (email, phone, role, name, last_name) 
    VALUES ("${email}", "${cellphone}", "client", "${name}", "${lastname}");
  `;

    connection.query(userQuery, async (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({
                error: error,
                message: 'Error in the query',
            });
        }
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
            res.status(200).json({
                message: 'Created account',
            });
        });
    });
});

router.put('/:id', validateToken, async (req, res) => {
    const { id } = req.params;
    const { email, cellphone, name, lastname, username, password } = req.body;
    const passwordHash = await encrypt(password);

    const userQuery = `UPDATE users SET email = '${email}', phone = '${cellphone}', name = '${name}', 
    last_name = '${lastname}' WHERE id = ${id};`;
    connection.query(userQuery, function (error, results) {
        if (error) {
            console.log(error);
            res.status(500).json({
                error: error,
                message: 'Error in the query'
            });
        } else {
            const accountQuery = `UPDATE account SET username = '${username}', password = '${passwordHash}' WHERE user_id = ${id};`;
            connection.query(accountQuery, function (error, results) {
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
                        message: 'Updated user'
                    });
                }
            });
        }
    });
});

router.delete('/:id', validateToken, (req, res) => {
    const { id } = req.params;
    const user = `SELECT deleted FROM users WHERE id = ${id};`;
    const query = `UPDATE users SET deleted = 0 WHERE id = ${id};`;

    connection.query(user, (error, results) => {
        if (error || results[0].deleted) {
            res.status(500).json({
                message: 'Error in the query',
                error
            });
        } else {
            connection.query(query, (error, results) => {
                if (error) {
                    res.status(500).json({
                        message: 'Error in the query',
                        error
                    });
                } else {
                    res.status(200).json({
                        mensaje: 'Deleted user'
                    });
                }
            });
        }
    });
});

module.exports = router;
