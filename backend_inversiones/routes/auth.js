import express from 'express';
import { compare } from '../helpers/handleBcrypt.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError, errorNotExists } from '../helpers/handleExceptions.js';
import { generateAccessToken } from '../services/jwtService.js';
import { Account } from '../models/mainExport.js';
import { validateData } from '../validations/validateData.js';


const router = express.Router();
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body); 
    try {
        validateData([username, password]);
        const account = await Account.findOne({ where: { username } });
        if (!account) {
            errorNotExists("auth");
        }
        const passwordMatch = await compare(password, account.password);
        if (!passwordMatch) {
            errorNotExists("auth");
        }
        const accessToken = generateAccessToken({ username: username });
        getHandleSuccess(200)(res, { account, token: accessToken }, "Authenticated user");
    } catch (error) {
        console.log(error); 
        console.log(res);
        getHandleError(error, res);    
    }
});

export default router;
