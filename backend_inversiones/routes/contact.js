var express = require('express');
var router = express.Router();
const conexion = require('../database');

router.get('/', function (req, res, next) {
  const query = 'SELECT * FROM contacto';
  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: error,
        message: 'Error in the query',
      });
    } else {
      res.status(200).json({
        data: results,
        message: 'Listing contacts',
      });

    }
  });
});

router.post('/', function (req, res, next) {
  const { nombre, apellido, email, telefono, comentarios, respuesta } = req.body;

  const query = `INSERT INTO contacto (nombre,apellido,email,telefono,comentarios,respuesta) VALUES ("${nombre}","${apellido}","${email}","${telefono}","${comentarios}","${respuesta}")`;
  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: error,
        message: 'Error in the query',
      });
    } else {
      console.log(results);
      res.status(200).json({
        data: results,
        message: 'Contact created',
      });
    }
  });
});

router.put('/:id', function (req, res, next) {
  const { nombre, apellido, email, telefono, comentarios, respuesta } = req.body;
  const { id } = req.params;
  const query = `UPDATE contacto SET nombre="${nombre}",apellido="${apellido}",email="${email}",telefono="${telefono}",comentarios="${comentarios}",respuesta="${respuesta}" WHERE id=${id}`;

  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: error,
        message: 'Error in the query',
      });
    } else {
      console.log(results);
      res.status(200).json({
        data: results,
        message: 'Answer updated',
      });
    }
  });

});
router.patch('/:id', function (req, res, next) {
  const { id } = req.params;

  const query = `UPDATE contacto SET eliminado = CASE WHEN eliminado = '1' THEN '0'ELSE '1'END WHERE id = "${id}" ;`;

  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: error,
        message: 'Error in the query',
      });
    } else {
      console.log(req.params.id);
      res.status(200).json({
        data: req.params.id,
        message: 'Contact deleted',
      });
    }
  });
});

module.exports = router;