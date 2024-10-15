var express = require('express');
var router = express.Router();
var connection = require('../database');

//CRUD CATEGORIA POST (<ARHUIZA>)
router.get('/', function (req, res, next) {
    const query = 'SELECT * FROM categorias_posts;';

    connection.query(query, function (error, results, fields) {
        if (error) {
            return res.status(500).json({
                error: error,
                message: 'ERROR AL RECUPERAR CATEGORIA POST',
            });
        }

        res.status(200).json({
            data: results,
            message: 'CATEGORIA POST RECUPERADO CON EXITO',
        });
    });
});


router.post('/', function (req, res, next) {
    const { nombre } = req.body; // Supongo que solo tienes el nombre de la categoría

    const query = 'INSERT INTO categorias_posts (nombre) VALUES (?);';

    connection.query(query, [nombre], function (error, results, fields) {
        if (error) {
            return res.status(500).json({
                error: error,
                message: 'ERROR AL CREAR CATEGORIA POST',
            });
        }

        res.status(201).json({
            message: 'CATEGORIA POST CREADA CON EXITO',
        });
    });
});


router.put('/:id', function (req, res, next) {
    const categoryId = req.params.id;
    const { nombre } = req.body;

    const query = 'UPDATE categorias_posts SET nombre = ? WHERE id = ?;';

    connection.query(query, [nombre, categoryId], function (error, results, fields) {
        if (error) {
            return res.status(500).json({
                error: error,
                message: 'ERROR AL ACTUALIZAR CATEGORIA POST',
            });
        }

        res.status(200).json({
            message: 'CATEGORIA POST ACTUALIZADA CON EXITO !!! ',
        });
    });
});

router.delete('/:id', function (req, res, next) {
    const categoryId = req.params.id;

    const query = 'DELETE FROM categorias_posts WHERE id = ?;';

    connection.query(query, [categoryId], function (error, results, fields) {
        if (error) {
            return res.status(500).json({
                error: error,
                message: 'ERROR AL ELIMINAR CATEGORIA POST',
            });
        }

        res.status(200).json({
            message: 'CATEGORIA POST ELIMINADA CON EXITO',
        });
    });
});

module.exports = router;
