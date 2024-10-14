var express = require('express');
var router = express.Router();
var conexion = require('../database');

// obtener ajustes
router.get('/', function (req, res) {

    var query = 'SELECT * FROM inversiones;';

    conexion.query(query, function (error, results) {
        if (error) {
            console.log(error);
            res.status(500).send({
                error: error,
                message: 'Error al realizar la petición'
            })
        } else {
            console.log(results);
            res.status(200).send({
                data: results,
                message: 'Vista de Inversiones'
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
          message: 'Error al realizar la petición'
        })
      } else {
        console.log(results.insertId);
        res.status(200).send({
          data: results.insertId,
          message: 'Inversión registrada correctamente'
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
          message: 'Error al realizar la petición'
        })
      } else {
        console.log(results);
        res.status(200).send({
          data: results.insertId,
          message: 'Inversión modificada correctamente'
        });
      }
    });

  });
  
  router.delete('/:id', function (req, res, next) {
    var query = `DELETE FROM inversiones WHERE id = ${req.params.id};`;

    conexion.query(query, function (error, results, fields) {
      if (error) {
        console.log(error);
        res.status(500).send({
          error: error,
          message: 'Error al realizar la petición'
        });
      } else {
        console.log(req.params.id);
        res.status(200).send({
          data: req.params.id,
          message: 'Inversión eliminada correctamente'
        });
      }
    });

  });

module.exports = router;