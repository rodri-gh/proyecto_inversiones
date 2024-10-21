var express = require('express');
var router = express.Router();
var conexion = require('../database');

router.get('/', function (req, res) {

  var query = 'SELECT * FROM project_timeline;';

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
        message: 'Project timeline view'
      });
    }
  });
});
router.get('/:id', function (req, res) {

  const { id } = req.params;

  var query = `SELECT * FROM project_timeline WHERE project_id = ${id} ;`;

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
        message: 'Project timeline view'
      });
    }
  });
});

router.post('/', function (req, res, next) {
  const { project_id, phase, start_date, end_date, status, description, price_mineral_1, price_mineral_2 } = req.body;

  var query = `INSERT INTO project_timeline (project_id, phase, start_date, end_date, status, description, price_mineral_1, price_mineral_2)
 VALUES (' ${project_id}', '${phase}', '${start_date}', '${end_date}', '${status}', '${description}', '${price_mineral_1}', '${price_mineral_2}');`;

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
        message: 'Project timeline registered correctly'
      });
    }
  });

});

router.put('/:id', function (req, res, next) {
  const { project_id, phase, start_date, end_date, status, description, price_mineral_1, price_mineral_2 } = req.body;

  var query = `UPDATE project_timeline SET project_id="${project_id}", phase="${phase}", start_date="${start_date}", end_date="${end_date}", status="${status}", description="${description}", price_mineral_1="${price_mineral_1}", price_mineral_2="${price_mineral_2}" 
                WHERE id = ${req.params.id} ;`;

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
        message: 'The project timeline was updated successfully'
      });
    }
  });
});
module.exports = router;