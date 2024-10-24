var express = require('express');
var router = express.Router();
var connection = require('../database');

//insertar un contacto  POST
router.post('/', function (req, res, next) {
    const { name, lastname, email, phone, comments, answer, deleted } = req.body;

    const query = `INSERT INTO contacts (name, lastname, email, phone, comments, answer, deleted)
                   VALUES ( ?, ?, ?, ?, ?, 'pending', 1)`;

    connection.query(query, [name, lastname, email, phone, comments, answer, deleted], function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).json({
                error: error,
                message: 'error creating contact'
            });
        }
        res.status(201).json({
            message: 'contact created successfully',
            data: results
        });
    });
});

router.get('/', function (req, res, next) {

    const query = 'SELECT * FROM contacts;';
    connection.query(query, function (error, results) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'contact not found'
            });
        } else {
            console.log(results);
            res.status(200).send({
                data: results,
                message: 'contact details'
            });
        }
    });
});

// para actualizar un contacto PUT 
// router.put('/:contact_id', function (req, res, next) {
//     const { contact_id } = req.params;
//     const { user_id, name, lastname, email, phone, comments, answer, deleted } = req.body;
//     const query = `UPDATE contacts SET user_id = ?, name = ?, lastname = ?, email = ?, phone = ?, comments = ?, answer = ?, deleted = ?
//                    WHERE contact_id = ?`;
//     connection.query(query, [user_id, name, lastname, email, phone, comments, answer, deleted, contact_id], function (error, results) {
//         if (error) {
//             console.log(error);
//             return res.status(500).json({
//                 error: error,
//                 message: 'error updating contact'
//             });
//         }
//         res.status(200).json({
//             message: 'contact updated successfully',
//             data: results
//         });
//     });
// });

router.patch('/:contact_id', function (req, res, next) {
    const { contact_id } = req.params;
    const query = `UPDATE contacts SET answer = CASE WHEN answer = 'pending' THEN 'answered' END WHERE contact_id = ?`;
    connection.query(query, [contact_id], function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).json({
                error: error,
                message: 'Error deleting contact'
            });
        } else {
            res.status(204).json({
                message: 'Contact deleted successfully'
            });
        }
    });
});

//para borrar un contacto DELETE 
// router.delete('/:contact_id', function (req, res, next) {
//     const { contact_id } = req.params;
//     const query = 'UPDATE contacts SET deleted = !deleted WHERE contact_id = ?';
//     connection.query(query, [contact_id], function (error, results) {
//         if (error) {
//             console.log(error);
//             return res.status(500).json({
//                 error: error,
//                 message: 'Error deleting contact'
//             });
//         } else {
//             res.status(204).json({
//                 message: 'Contact deleted successfully'
//             });
//         }
//     });
// });
router.delete('/:contact_id', function (req, res, next) {
    const { contact_id } = req.params;
    const query = `UPDATE contacts SET deleted = !deleted WHERE contact_id = ${contact_id};`;
    connection.query(query, function (error, results) {
        if (error) {
            console.log(error);
            return res.status(500).json({
                error: error,
                message: 'Error deleting contact'
            });
        } else {
            res.status(204).json({
                message: 'Contact deleted successfully'
            });
        }
    });
});

//exporto el enrutador 
module.exports = router; 