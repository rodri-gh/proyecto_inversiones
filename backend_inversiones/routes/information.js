var express = require('express');
var router = express.Router();
var connection = require('../database');

router.get('/', function(req, res, next) {
    var query = `SELECT * FROM informacion`;

    connection.query(query, function (error, result, fields) {
        if (error){
            console.log(error);
            res.status(500).send({
                error: error,
                message: "Error al realizar la peticion"
            });
        }else{
            console.log(result);
            res.status(200).send({
                data: result,
                message: "Peticion exitosa"
            })
        }
    }); 
});

router.post('/', function(req, res, next) {
    const {cliente_id, nombre, codigo, imagen, categoria_mineral_id, descripcion, monto_inversion, cantidad_maxima_inversiones, vision} = req.body;
    var query = `INSERT INTO informacion(cliente_id, nombre, codigo, imagen, categoria_mineral_id, descripcion, monto_inversion, cantidad_maxima_inversiones, vision) VALUES('${cliente_id}', '${nombre}', '${codigo}', '${imagen}', '${categoria_mineral_id}', '${descripcion}', '${monto_inversion}', '${cantidad_maxima_inversiones}', '${vision}')`;

    connection.query(query, function (error, result, fields) {
        if (error){
            console.log(error);
            res.status(500).send({
                error: error,
                message: "Error al realizar la peticion"
            });
        }else{
            console.log(result);
            res.status(200).send({
                data: result,
                message: "Registro exitoso"
            })
        }
    });
});

router.put('/:id', function(req, res, next) {
    const {cliente_id, nombre, codigo, imagen, categoria_mineral_id, descripcion, monto_inversion, cantidad_maxima_inversiones, vision} = req.body;

    var query = `UPDATE informacion SET
                cliente_id = '${cliente_id}',
                nombre = '${nombre}',
                codigo = '${codigo}',
                imagen = '${imagen}',
                categoria_mineral_id = '${categoria_mineral_id}',
                descripcion = '${descripcion}',
                monto_inversion = '${monto_inversion}',
                cantidad_maxima_inversiones = '${cantidad_maxima_inversiones}',
                vision = '${vision}'
                WHERE id = ${req.params.id}`;
    connection.query(query, function (error, result, fields) {
        if (error){
            console.log(error);
            res.status(500).send({
                error: error,
                message: "Error al realizar la peticion"
            });
        }else{
            console.log(result);
            res.status(200).send({
                data: result,
                message: "Actualizacion exitosa"
            })
        }
    });
});

router.delete('/:id', function(req, res, next) {
    var query = `DELETE FROM informacion WHERE id = ${req.params.id}`;
    connection.query(query, function (error, result, fields) {
        if (error){
            console.log(error);
            res.status(500).send({
                error: error,
                message: "Error al realizar la peticion"
            });
        }else{
            console.log(result);
            res.status(200).send({
                data: result,
                message: "Eliminacion exitosa"
            })
        }
    });
});


module.exports = router;