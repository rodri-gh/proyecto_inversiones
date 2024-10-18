var express = require('express');
var router = express.Router();
var connection = require('../database');

router.get('/', function(req, res, next) {
    const query = `
        SELECT project_updates.*, projects.name AS project_name 
        FROM project_updates 
        INNER JOIN projects ON project_updates.project_id = projects.id 
        WHERE project_updates.deleted = 1 
        ORDER BY project_updates.id ASC;
    `;

    connection.query(query, function(error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).json({
                error: error,
                message: 'Error in the query'
            });
        } else {
            console.log(results);
            res.status(200).json({
                data: results,
                message: 'List of project updates'
            });
        }
    });
});

router.post('/', function(req, res, next) {
    const { project_id, update_type, description } = req.body;

    const query = `
        INSERT INTO project_updates (project_id, update_type, description, update_date) 
        VALUES ('${project_id}', '${update_type}', '${description}', CURRENT_TIMESTAMP());
    `;
    
    connection.query(query, function(error, results) {
        if (error) {
            console.log(error);
            res.status(500).json({
                error: error,
                message: 'Error in the query'
            });
        } else {
            console.log(results);
            res.status(200).json({
                data: results,
                message: 'Project update created'
            });
        }
    });
});

router.put('/:id', function(req, res, next) {
    const { id } = req.params;
    const { project_id, update_type, description } = req.body;

    const query = `
        UPDATE project_updates 
        SET project_id = '${project_id}', update_type = '${update_type}', description = '${description}' 
        WHERE id = ${id};
    `;
    
    connection.query(query, function(error, results) {
        if (error) {
            console.log(error);
            res.status(500).json({
                error: error,
                message: 'Error in the query'
            });
        } else {
            console.log(results);
            res.status(200).json({
                data: results,
                message: 'Project update updated'
            });
        }
    });
});

router.delete('/:id', function(req, res, next) {
    const { id } = req.params;

    const query = `
        UPDATE project_updates 
        SET deleted = 0 
        WHERE id = ${id};
    `;
    
    connection.query(query, function(error, results) {
        if (error) {
            console.log(error);
            res.status(500).json({
                error: error,
                message: 'Error in the query'
            });
        } else {
            console.log(results);
            res.status(200).json({
                data: results,
                message: 'Project update deleted'
            });
        }
    });
});

module.exports = router;
