var express = require('express');
var router = express.Router();
const connection = require('../database');
const { compare } = require('../helpers/handleBcrypt');
const jwt = require('jsonwebtoken');


router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    const userQuery = `SELECT * FROM account WHERE username = "${username}"`;

    connection.query(userQuery, async (error, results, fields) => {
        if (error || results.length === 0) {
            console.log(error);
            res.status(500).json({
                error: error,
                message: 'Error in the query',
            });
            return;
        }
        const checkPassword = await compare(password, results[0].password)
        if (checkPassword) {
            const userId = results[0].id;
            const accessToken = generateAccessToken({ username: username, user_id: userId })
            res.header('authorization', accessToken).json({
                data: results[0],
                message: 'Authenticated user',
                token: accessToken
            });
            return;
        }
        if (!checkPassword) {
            res.status(409);
            res.send({
                error: 'Invalid account'
            })
            return;
        }
    });
});

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.SECRET, { expiresIn: '1h' })
}

const validateToken = (req, res, next) => {
    const accessToken = req.headers['authorization'];
    
    if (!accessToken) {
        return res.status(403).send('Access denied: No token provided');
    }
    const token = accessToken.split(' ')[1];
    if (!token) {
        return res.status(403).send('Access denied: Invalid token format');
    }
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Access denid, token expired or incorrect');
        } else {
            req.user = user;
            next();
        }
    });
}

module.exports = router
module.exports.validateToken = validateToken;