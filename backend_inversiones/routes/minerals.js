var express = require('express');
var router = express.Router();
const conection = require('../database');

router.get('/', function (req, res, next) {
  const query = 'SELECT * FROM minerals;';
  conection.query(query, function (error, results, fields) {
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
        message: 'List of minerals',
      });
    }
  });
});

router.post('/', function (req, res, next) {
  const { name } = req.body;
  const query = `INSERT INTO minerals (name) VALUES ('${name}');`;
  conection.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: error,
        message: 'Error in the query',
      });
    } else {
      console.log(results);
      res.status(201).json({
        data: results,
        message: 'Mineral created',
      });
    }
  });
});


router.put('/:id', function (req, res, next) {
  const { id } = req.params;
  const { name } = req.body;
  const query = `UPDATE minerals SET name = '${name}' WHERE id = ${id};`;
  conection.query(query, function (error, results, fields) {
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
        message: 'Mineral updated',
      });
    }
  });
});

router.delete('/:id', function (req, res, next) {
  const { id } = req.params;
  const query = `UPDATE minerals SET deleted = !deleted WHERE id = ${id};`;
  conection.query(query, function (error, results, fields) {
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
        message: 'Mineral deleted',
      });
    }
  });
});


module.exports = router;

