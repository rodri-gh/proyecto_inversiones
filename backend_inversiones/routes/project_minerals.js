var express = require('express');
var router = express.Router();
var connection = require('../database');


// CREATE - Añadir un nuevo project_mineral
router.post('/', (req, res) => {
    const { project_id, mineral_id } = req.body;
    const query = 'INSERT INTO project_minerals (project_id, mineral_id) VALUES (?, ?)';
    
    connection.query(query, [project_id, mineral_id], (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Error al crear project_mineral', error });
      } else {
        res.status(201).json({ id: results.insertId, message: 'Project_mineral creado exitosamente' });
      }
    });
  });
  
  // READ - Obtener todos los project_minerals no eliminados
  router.get('/', (req, res) => {
    const query = 'SELECT * FROM project_minerals WHERE deleted = 1';
    
    connection.query(query, (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Error al obtener project_minerals', error });
      } else {
        res.json(results);
      }
    });
  });
  
  // READ - Obtener un project_mineral específico por ID
  router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM project_minerals WHERE id = ? AND deleted = 0';
    
    connection.query(query, [req.params.id], (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Error al obtener project_mineral', error });
      } else if (results.length === 0) {
        res.status(404).json({ message: 'Project_mineral no encontrado' });
      } else {
        res.json(results[0]);
      }
    });
  });
  
  // UPDATE - Actualizar un project_mineral existente
  router.put('/:id', (req, res) => {
    const { project_id, mineral_id } = req.body;
    const query = 'UPDATE project_minerals SET project_id = ?, mineral_id = ? WHERE id = ? AND deleted = 1';
    
    connection.query(query, [project_id, mineral_id, req.params.id], (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Error al actualizar project_mineral', error });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Project_mineral no encontrado o ya eliminado' });
      } else {
        res.json({ message: 'Project_mineral actualizado exitosamente' });
      }
    });
  });
  
  // DELETE - Eliminación lógica de un project_mineral
  router.patch('/:id', (req, res) => {
    const query = 'UPDATE project_minerals SET deleted = NOT deleted WHERE id = ?';
    
    connection.query(query, [req.params.id], (error, results) => {
      if (error) {
        res.status(500).json({ message: 'Error al eliminar project_mineral', error });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Project_mineral no encontrado o ya eliminado' });
      } else {
        res.json({ message: 'Estado de project_mineral alternado exitosamente' });
      }
    });
  });


module.exports = router