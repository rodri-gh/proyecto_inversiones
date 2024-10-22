var express = require('express'); 
var router = express.Router();
var connection = require('../database');
const jwt = require('jsonwebtoken');
const { validateToken } = require('./auth');

//insertar un movimiento  POST
router.post('/', validateToken,function(req, res){
    const { user_id, description, type, amount, request_date, state } = req.body; 

    const query = `INSERT INTO movements (user_id, description, type, amount, request_date, state) VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(query, [user_id, description, type, amount, request_date, state], function(error, results) {
        if (error) { 
            console.log(error);
            return res.status(500).json({
                error: error,
                message: 'error inserting movement'
            });
        } 
        res.status(201).json({ 
            message: 'movement created successfully',
            data: results
        }); 
    });
 });

 // obtener todos los movimientos  GET
 router.get ('/', validateToken, function(req, res){
    const query = `SELECT * FROM movements WHERE user_id = ?`;
    connection.query(query, [req.user.user_id], function(error, results){
        if (error) { 
            console.log(error);
            return res.status(500).json({
                error: error,
                message: 'error in query'
            });   
        }
        res.status(200).json({
            message: 'List of movements',
            data: results, 
        });
    });
 });

 //obtener un contacto por su id  GET
 router.get('/:movement_id', validateToken, function(req, res){
    const { movement_id } = req.params;
    const query = `SELECT * FROM movements WHERE movement_id = ? AND user_id = ?`;
    connection.query(query, [movement_id, req.user.user_id], function(error, results){
        if (error || results.length == 0) { 
            console.log(error);
            return res.status(404).json({
                error: error,
                message: 'movement not found'
            });
        }
        res.status(200).json({ 
            data: results[0],
            message: 'movement details'
        });
    });
 });

 // para actualizar un contacto PUT 
 router.put('/:movement_id', validateToken, function(req, res){ 
    const { movement_id } = req.params;
    const { description, type, amount, request_date, disbursement_date, state } = req.body;
    const query = `UPDATE movements SET description = ?, type = ?, amount = ?, request_date = ?, disbursement_date = ?,
                     state = ? WHERE movement_id = ? AND user_id = ?`;
    connection.query(query, [description, type, amount, request_date, disbursement_date, state, movement_id, req.user.user_id], function(error, results) {
        if (error) { 
            console.log(error);
            return res.status(500).json({
                error: error,
                message: 'error updating movement'
            });
        }
        res.status(200).json({
            data: results,
            message: 'Movement updated successfully',
        });
    });
 });

 //para borrar un contacto DELETE 
 router.delete('/:movement_id', validateToken, function(req, res) { 
    const { movement_id } = req.params;
    const query = `DELETE FROM movements WHERE movement_id = ? AND user_id = ?`;
    connection.query(query, [movement_id, req.user.user_id], function(error, results){ 
        if (error) { 
            console.log(error);
            return res.status(500).json({
                error: error,
                message: 'Error deleting movement'
            });
        }
        res.status(204).json({
            message: 'Movement deleted successfully'
        });
    });
 });

 //exporto el enrutador 
 module.exports = router; 