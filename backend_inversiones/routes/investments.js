var express = require('express');
var router = express.Router();
var conexion = require('../database');

router.get('/', function (req, res) {

    var query = 'SELECT * FROM inversiones;';

    conexion.query(query, function (error, results) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error when making the request'
            })
        } else {
            console.log(results);
            res.status(200).send({
                data: results,
                message: 'Investment view'
            });
        }
    });
});

router.post('/', function (req, res, next) {
    const { cliente_id, inversor_id, monto, tipo_ganancia, ganancia_estimada, fecha_deposito } = req.body;

    var query = `INSERT INTO inversiones (cliente_id, inversor_id, monto, tipo_ganancia, ganancia_estimada, fecha_deposito)
 VALUES ('${cliente_id}','${inversor_id}','${monto}','${tipo_ganancia}','${ganancia_estimada}','${fecha_deposito}');`;

    conexion.query(query, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error when making the request'
            })
        } else {
            console.log(results.insertId);
            res.status(200).send({
                data: results.insertId,
                message: 'Investment registered correctly'
            });
        }
    });

});

router.put('/:id', function (req, res, next) {
    const { cliente_id, inversor_id, monto, tipo_ganancia, ganancia_estimada, fecha_deposito } = req.body;

    var query = `UPDATE inversiones SET cliente_id="${cliente_id}", inversor_id="${inversor_id}", monto="${monto}", tipo_ganancia="${tipo_ganancia}", ganancia_estimada="${ganancia_estimada}", fecha_deposito="${fecha_deposito}" WHERE id = ${req.params.id};`;

    conexion.query(query, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error when making the request'
            })
        } else {
            console.log(results);
            res.status(200).send({
                data: results.insertId,
                message: 'The field was updated successfully'
            });
        }
    });
});

router.patch('/:id', function (req, res, next) {

    const query = `UPDATE inversiones SET eliminado = CASE WHEN eliminado = '1' THEN '0' ELSE '1' END WHERE id = "${req.params.id}";`;
    conexion.query(query, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error when making the request'
            });
        } else {
            res.status(200).send({
                data: results,
                message: 'The field was updated successfully'
            });
        }
    });
});
module.exports = router;