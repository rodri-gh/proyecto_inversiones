import { handleDuplicateValue, handleError } from '../helpers/handleExceptions.js';
import { connection } from './jwtService.js';
import { getHandleSuccess } from '../helpers/handleSuccess.js';


export const executeQuery = async (query, res, message = null, next, code) => {
    try {
        const conn = await connection.getConnection();
        const [results, fields] = await conn.query(query);
        conn.release();
        getHandleSuccess(code)(res, results, message);
    } catch (error) {
        handleError(error);
    }
};

export const executeQueryWithReturn = async (query, res, message = null) => {
    try {
        const conn = await connection.getConnection();
        const [results, fields] = await connection.query(query);
        conn.release();
        return results;
    } catch (error) {
        //TODO: utilizar un switch para crear los errores
        if (error.code === 'ER_DUP_ENTRY') {
            handleDuplicateValue(res, error.sqlMessage);
        }
        handleError(error);
    }
};

export const response = async (res, data, message = null) => {
    try {
        const conn = await connection.getConnection();
        const [results, fields] = await connection.query(query);
        conn.release();
        return results;
    } catch (error) {
        //TODO: utilizar un switch para crear los errores
        if (error.code === 'ER_DUP_ENTRY') {
            handleDuplicateValue(res, error.sqlMessage);
        }
        handleError(error);
    }
};
