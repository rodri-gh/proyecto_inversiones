var express = require('express');
var router = express.Router();
var connection = require('../database');

// CRUD FAQ (<ARUHIZA>)



router.get('/', function (req, res, next) {
    const query = 'SELECT * FROM faq;';

    connection.query(query, function (error, results, fields) {
        if (error) {
            return res.status(500).json({
                error: error,
                message: 'ERRO AL RECIBIR FAQs',
            });
        }

        res.status(200).json({
            data: results,
            message: 'FAQs RECIBIDO CON EXITO',
        });
    });
});


router.post('/', function (req, res, next) {
    const { pregunta, respuesta, eliminado } = req.body;

    const query = 'INSERT INTO faq (pregunta, respuesta, eliminado) VALUES (?, ?, ?);';

    connection.query(query, [pregunta, respuesta, eliminado], function (error, results, fields) {
        if (error) {
            return res.status(500).json({
                error: error,
                message: 'ERROR AL CREAR FAQ',
            });
        }

        res.status(201).json({
            message: 'FAQ CREADO CON EXITO',
        });
    });
});

router.put('/:id', function (req, res, next) {
    const { pregunta, respuesta, eliminado } = req.body;
    const postId = req.params.id;

    const query = 'UPDATE faq SET pregunta = ?, respuesta = ?, eliminado = ? WHERE id = ?;';

    connection.query(query, [pregunta, respuesta, eliminado, postId], function (error, results, fields) {
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
    const query = "UPDATE faq SET eliminado = CASE WHEN  eliminado = '1' THEN '0' ELSE '1' END WHERE id = ?;";

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