var express = require('express');
var router = express.Router();
var connection = require('../database');

router.get('/', function(req, res, next) {
    const query = 'SELECT * FROM contracts;';

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
                message: 'List of contracts'
            });
        }
    });
});

router.post('/', function(req, res, next) {
    console.log("Request body: ", req.body);  // Imprime el cuerpo de la petición

    const { project_id, user_id, investment_id, contract_code, contract_date, contract_file_path } = req.body;

    if (!project_id || !user_id || !investment_id || !contract_code || !contract_date || !contract_file_path) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const query = `INSERT INTO contracts (project_id, user_id, investment_id, contract_code, contract_date, contract_file_path) VALUES (?, ?, ?, ?, ?, ?)`;
    connection.query(query, [project_id, user_id, investment_id, contract_code, contract_date, contract_file_path], function(error, results) {
        if (error) {
            console.log(error);
            return res.status(500).json({
                error: error.sqlMessage,
                message: 'Error in the query'
            });
        }
        res.status(200).json({
            data: results,
            message: 'Contract created'
        });
    });
});



// router.post('/', function(req, res, next) {

//     const {project_id, user_id, investment_id, contract_code, contract_date, contract_file_path} = req.body; 
    
    
//     const query = `INSERT INTO contracts (project_id, user_id, investment_id, contract_code, contract_date, contract_file_path) VALUES ("${project_id}", "${user_id}", "${investment_id}", "${contract_code}", "${contract_date}", "${contract_file_path}");`;
//     connection.query(query, function(error, results) {
//         if (error){
//             console.log(error);
//             res.status(500).json({
//                 error: error,
//                 message: 'Error in the query'
//             });
//         }else{
//             console.log(results);
//             res.status(200).json({
//                 data: results,
//                 message: 'contract created'
//             });
//         }
//     });
// });

router.put('/:id', function(req, res, next) {
    const {id} = req.params;
    const {project_id, user_id, investment_id, contract_code, contract_date, contract_file_path} = req.body;


    const query = `UPDATE contracts SET project_id = '${project_id}', user_id = '${user_id}', investment_id = '${investment_id}', contract_code = '${contract_code}', contract_date = '${contract_date}', contract_file_path = '${contract_file_path}' WHERE id = ${id};`;
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
                message: 'Contract updated'
            });
        }
    });
});

router.delete('/:id', function(req, res, next) {
    const {id} = req.params;
    const query = `UPDATE contracts SET deleted = CASE
                    WHEN deleted = '1' THEN '0'
                    ELSE '1'
                    END WHERE id = ${id};`;
    connection.query(query, function(error, results) {
        if (error){
            res.status(500).json({
                message: 'Error updating motion status',
                error
            });
        }else if(results.affectedRows === 0) {
            res.status(404).json({ mensaje: 'Movement not found' });
        } else {
            res.status(200).json({ mensaje: 'Movement successfully updated' });
        }
    });
});



module.exports = router;