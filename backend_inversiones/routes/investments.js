var express = require('express');
var router = express.Router();
var connection = require('../database');

router.get('/', function(req, res, next) {
    const query = 'SELECT investments.*, projects.name AS project_name, users.name AS user_name FROM investments INNER JOIN projects ON investments.project_id = projects.id INNER JOIN users ON investments.user_id = users.id ;';

    connection.query(query, function(error, results, fields) {
        if (error){
            console.log(error);
            res.status(500).json({
                error: error,
                message: 'Error in the query'
            });
        }else{
            console.log(results);
            res.status(200).json({
                data: results,
                message: 'List of investments'
            });
        }
    });
});

router.post('/', function(req, res, next) {
    const {project_id, user_id, amount}=req.body;

    const query = `INSERT INTO investments (project_id, user_id, amount, investment_date) VALUES ('${project_id}', '${user_id}', '${amount}', CURRENT_TIMESTAMP())`;
    connection.query(query, function(error, results) {
        if (error){
            console.log(error);
            res.status(500).json({
                error: error,
                message: 'Error in the query'
            });
        }else{
            console.log(results);
            res.status(200).json({
                data: results,
                message: 'Investment created'
            });
        }
    });
});

router.put('/:id', function(req, res, next) {
    const {id} = req.params;
    const {project_id, user_id, amount}=req.body;

    const query = `UPDATE investments SET project_id = '${project_id}', user_id = '${user_id}', amount = '${amount}' WHERE id = ${id};`;
    connection.query(query, function(error, results) {
        if (error){
            console.log(error);
            res.status(500).json({
                error: error,
                message: 'Error in the query'
            });
        }else{
            console.log(results);
            res.status(200).json({
                data: results,
                message: 'Investment updated'
            });
        }
    });
});





module.exports = router;