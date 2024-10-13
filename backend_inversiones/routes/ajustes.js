var express = require('express');
var router = express.Router();
var conexion = require('../database');


router.get('/', function (req, res) {

    var query = 'SELECT * FROM ajustes;';

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
                message: 'Vista de Ajustes'
            });
        }

    });

});
// actualizar ajustes
router.put('/:id', function (req, res, next) {
    const { comision_fija_ganancia_inversionista, comision_porcentual_ganancia_inversionista, comision_fija_retiro_admin, comision_porcentual_retiro_admin, tiempo_minimo_inversion, tiempo_maximo_inversion, sancion_porcentual_retraso } = req.body;

    var query = `UPDATE ajustes SET comision_fija_ganancia_inversionista = "${comision_fija_ganancia_inversionista}", comision_porcentual_ganancia_inversionista = "${comision_porcentual_ganancia_inversionista}", comision_fija_retiro_admin = "${comision_fija_retiro_admin}", comision_porcentual_retiro_admin = "${comision_porcentual_retiro_admin}", tiempo_minimo_inversion = "${tiempo_minimo_inversion}", tiempo_maximo_inversion = "${tiempo_maximo_inversion}", sancion_porcentual_retraso = "${sancion_porcentual_retraso}" WHERE id = ${req.params.id};`;

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
          message: 'Ajuste modificado correctamente'
        });
      }
    });

  });


module.exports = router;