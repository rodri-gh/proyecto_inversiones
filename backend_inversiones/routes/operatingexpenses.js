var express = require('express');
var router = express.Router();
var connection = require('../database');


router.get('/', function (req, res) {
  const query = `SELECT * FROM operating_expenses;`;

  connection.query(query, function (error, results) {
    if (error) {
      return res.status(500).json({
        error: error,
        message: 'Error en la consulta'
      });
    }

    res.status(200).json({
      data: results,
      message: 'List of operating_expenses'
    });
  });

});


router.post('/', (req, res) => {
  const { name, description, expenses, project_id } = req.body;

  const query = 'INSERT INTO operating_expenses (name, description, expenses, project_id) VALUES (?, ?, ?, ?);';

  connection.query(query, [name, description, expenses, project_id], function (error, results) {
    if (error) {
      return res.status(400).json({
        error: error,
        message: 'Project ID error post',
      });
    }

    res.status(201).json({
      message: 'POST succesfully'
    })
  });
});


router.put('/:id', (req, res) => {
  const { name, description, expenses, project_id } = req.body;
  const id = req.params.id;

  const query = 'UPDATE operating_expenses SET name = ?, description = ?, expenses = ?, project_id = ? WHERE id = ?';

  connection.query(query, [name, description, expenses, project_id, id], function (error, results) {
    if (error) {
      return res.status(500).json({
        message: 'Project ID ERROR'
      });
    }

    res.status(200).json({
      error: error,
      message: 'Succesfully PUT'
    });
  });
});


router.patch('/:id', function (req, res) {

  const query = 'UPDATE  operating_expenses SET deleted = !deleted WHERE id= ?;';

  connection.query(query, [req.params.id], function (error, results) {
    if (error) {
      res.status(500).json({
        error: error,
        message: 'Error DELETE'
      });
    }
    res.status(200).json({
      message: 'Succesfully DELETE'
    });
  });
});




module.exports = router