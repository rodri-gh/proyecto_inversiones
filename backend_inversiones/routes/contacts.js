var express = require('express');
var router = express.Router();
var connection = require('../database');

//insertar un contacto  POST
router.post('/', function(req, res, next){
    const { user_id, name, lastname, email, phone, comments, answer, status } = req.body; 

    const query = `INSERT INTO contacts (user_id, name, lastname, email, phone, comments, answer, status)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(query, [user_id, name, lastname, email, phone, comments, answer, status], function(error, results) {
        if (error) { 
            console.log(error);
            return res.status(500).json({
                error: error,
                message: 'error creating contact'
            });
        } 
        res.status(201).json({ 
            message: 'contact created successfully',
            data: results
        }); 
    });
 });

 // obtener todos los contactos  GET
 router.get ('/', function(req, res, next){
    const query = 'SELECT * FROM contacts';

    connection.query(query, function(error, results){
        if (error) { 
            console.log(error);
            return res.status(500).json({
                error: error,
                message: 'error fetching contacts'
            });   
        }
        res.status(200).json({
            data: results, 
            message: 'List of contacts'
        });
    });
 });

 //obtener un contacto por su id  GET
 router.get('/:contact_id', function(req, res, next){
    const { contact_id } = req.params;
    const query = 'SELECT * FROM contacts WHERE contact_id = ?';
    connection.query(query, [contact_id], function(error, results){
        if (error || results.length == 0) { 
            console.log(error);
            return res.status(404).json({
                error: error,
                message: 'contact not found'
            });
        }
        res.status(200).json({ 
            data: results[0],
            message: 'contact details'
        });
    });
 });

 // para actualizar un contacto PUT
 router.put('/:contact_id', function(req, res, next ){ 
    const { contact_id } = req.params;
    const { user_id, name, lastname, email, phone, comments, answer, status} = req.body;
    const query = `UPDATE contacts SET user_id = ?, name = ?, lastname = ?, email = ?, phone = ?, comments = ?, answer = ?, status = ?
                   WHERE contact_id = ?`;
    connection.query(query, [user_id, name, lastname, email, phone, comments, answer, status, contact_id], function(error, results) { 
        if (error) { 
            console.log(error);
            return res.status(500).json({
                error: error,
                message: 'error updating contact'
            });
        }
        res.status(200).json({
            message: 'contact updated successfully',
            data: results
        });
    });
 });

 //para borrar un contacto DELETE 
 router.delete('/:contact_id', function(req, res, next) { 
    const { contact_id } = req.params; 
    const query = 'DELETE FROM contacts WHERE contact_id = ?'; 
    connection.query(query, [contact_id], function(error, results){ 
        if (error) { 
            console.log(error);
            return res.status(500).json({
                error: error,
                message: 'Error deleting contact'
            });
        }
        res.status(204).json({
            message: 'Contact deleted successfully'
        });
    });
 });

 //exporto el enrutador 
 module.exports = router; 