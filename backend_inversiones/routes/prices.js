var express = require('express');
var router = express.Router();
var conexion = require('../database');

router.get('/', function (req, res) {

    var query = 'SELECT * FROM prices;';

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
                message: 'Prices view'
            });
        }
    });
});

router.post('/', function (req, res, next) {
    const { project_id, pre_purchase_price, purchase_price, mill_exit_price } = req.body;

    var query = `INSERT INTO prices (project_id, pre_purchase_price, purchase_price, mill_exit_price)
 VALUES (' ${project_id}', '${pre_purchase_price}', '${purchase_price}', '${mill_exit_price}');`;

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
                message: 'Price registered correctly'
            });
        }
    });

});

router.put('/:id', function (req, res, next) {
    const { project_id, pre_purchase_price, purchase_price, mill_exit_price } = req.body;

    var query = `UPDATE prices SET project_id="${project_id}", pre_purchase_price="${pre_purchase_price}", purchase_price="${purchase_price}", mill_exit_price="${mill_exit_price}" WHERE id = ${req.params.id};`;

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
                message: 'The price was updated successfully'
            });
        }
    });
});
module.exports = router;