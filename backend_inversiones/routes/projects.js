var express = require('express');
var router = express.Router();
var connection = require('../database');

router.get('/', function(req, res, next) {
    const query = 'SELECT * FROM projects;';

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
                message: 'List of projects'
            });
        }
    });
});

router.post('/', function(req, res, next) {
    const {name, description, status} = req.body;

    const proyectStatus = status || 'open';

    const query = `INSERT INTO projects (name, description, status, created_at) VALUES ('${name}', '${description}', '${proyectStatus}', CURRENT_TIMESTAMP())`;
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
                message: 'Project created'
            });
        }
    });
});

router.put('/:id', function(req, res, next) {
    const {id} = req.params;
    const {name, description, status} = req.body;

    // Valores permitidos para el campo 'status'
    const validStatuses = ['open', 'in_transit', 'closed'];

    // Verificar si el status es válido
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({
            message: 'Invalid status value. Allowed values are: open, in_transit, closed'
        });
    }

    const query = `UPDATE projects SET name = '${name}', description = '${description}', status = '${status}' WHERE id = ${id};`;
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
                message: 'Project updated'
            });
        }
    });
});

router.delete('/:id', function(req, res, next) {
    const {id} = req.params;
    const query = `UPDATE projects SET deleted = CASE
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

router.put('/status/:id', function(req, res, next) {
    const {id} = req.params;

    // Consulta para actualizar el estado de forma cíclica entre open, in_transit y closed
    const query = `UPDATE projects SET status = CASE
                    WHEN status = 'open' THEN 'in_transit'
                    WHEN status = 'in_transit' THEN 'closed'
                    ELSE 'open'
                    END WHERE id = ${id};`;
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
                message: 'Project closed'
            });
        }
    });
});

module.exports = router;