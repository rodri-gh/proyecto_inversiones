var express = require('express');
var router = express.Router();
var conexion = require('../database');

// obtener ajustes
router.get('/', function (req, res) {

    var query = 'SELECT * FROM links;';

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
    const { cliente_id, nombre, link, descripcion } = req.body;

    var query = `INSERT INTO links (cliente_id, nombre, link, descripcion) 
 VALUES ('${cliente_id}','${nombre}','${link}','${descripcion}');`;

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
          message: 'Link registrado correctamente'
        });
      }
    });

  });

router.put('/:id', function (req, res, next) {
    const { cliente_id, nombre, link, descripcion } = req.body;


    var query = `UPDATE links SET cliente_id="${cliente_id}", nombre="${nombre}", link="${link}", descripcion="${descripcion}" WHERE id = ${req.params.id};`;

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
          message: 'Link modificado correctamente'
        });
      }
    });

  });
  
  router.delete('/:id', function (req, res, next) {
    var query = `DELETE FROM links WHERE id = ${req.params.id};`;

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
          message: 'Link eliminado correctamente'
        });
      }
    });

  });

module.exports = router;