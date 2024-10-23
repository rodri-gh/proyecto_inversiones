var express = require('express');
var router = express.Router();
var connection = require('../database');

// CRUD FAQs (<ARUHIZA>)



router.get('/', function (req, res, next) {
    const query = 'SELECT * FROM faq;';

    connection.query(query, function (error, results, fields) {
        if (error) {
            return res.status(500).json({
                error: error,
                message: 'ERROR  RECIeve FAQs',
            });
        }

        res.status(200).json({
            data: results,
            message: 'FAQs SUCCESFULLY',
        });
    });
});


router.post('/', function (req, res, next) {
    const { ask, answer, status } = req.body;

    const query = 'INSERT INTO faq (ask, answer, status) VALUES (?, ?, ?);';

    connection.query(query, [ask, answer, status], function (error, results, fields) {
        if (error) {
            return res.status(500).json({
                error: error,
                message: 'ERROR to CREATE FAQ',
            });
        }

        res.status(201).json({
            message: 'FAQ CREATED SUCCESFULLY',
        });
    });
});

router.put('/:id', function (req, res, next) {
    const { ask, answer, status } = req.body;
    const postId = req.params.id;

    const query = 'UPDATE faq SET ask = ?, answer = ?, status = ? WHERE faq_id = ?;';

    connection.query(query, [ask, answer, status, postId], function (error, results, fields) {
        if (error) {
            return res.status(500).json({
                error: error,
                message: 'ERROR AL ACTUALIZAR FAQ',
            });
        }

        res.status(200).json({
            message: 'FAQ ACTUALIZADO CON EXITO',
        });
    });
});


router.patch('/:id', function (req, res, next) {
    //const postId = req.params.id; // Obtener el ID del post
    const query = "UPDATE faq SET status = CASE WHEN  status = '1' THEN '0' ELSE '1' END WHERE faq_id = ?;";

    connection.query(query, [req.params.id], function (error, results) {
        if (error) {
            return res.status(500).json({
                error: error,
                message: 'ERROR TO CREATE FAQ',
            });
        }

        res.status(201).json({
            message: 'FAQ DELETE SUCCESFULLY',
        });
    });


});

module.exports = router;