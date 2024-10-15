var express = require('express');
var router = express.Router();
var conexion = require('../database');

router.get('/', function (req, res) {

  var query = 'SELECT * FROM links;';
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
        message: 'Links view'
      });
    }
  });
});

router.post('/', function (req, res, next) {
  const { cliente_id, nombre, link, descripcion } = req.body;

  var query = `INSERT INTO links (cliente_id, nombre, link, descripcion) VALUES ('${cliente_id}','${nombre}','${link}','${descripcion}');`;

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
        message: 'Link was registered correctly'
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
        message: 'Error when making the request'
      })
    } else {
      console.log(results);
      res.status(200).send({
        data: results.insertId,
        message: 'Link was updated successfully'
      });
    }
  });
});
router.patch('/:id', function (req, res, next) {

  const query = `UPDATE links SET eliminado = CASE WHEN eliminado = '1' THEN '0' ELSE '1' END WHERE id = "${req.params.id}";`;
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
              message: 'Links was updated successfully'
          });
      }
  });
});
module.exports = router;