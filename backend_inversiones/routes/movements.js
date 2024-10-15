const express = require('express');
const router = express.Router();

var conexion = require('../database');

// CREATE - Crear un nuevo movimiento
router.post('/', async (req, res) => {
  const { tipo, monto, descripcion, fecha_solicitud, fecha_desembolso } = req.body;
  const query = 'INSERT INTO movimientos (tipo, monto, descripcion, fecha_solicitud, fecha_desembolso) VALUES (?, ?, ?, ?, ?, )';
  const values = [tipo, monto, descripcion, fecha_solicitud, fecha_desembolso];

  conexion.query(query, values, (error, results) => {
    if (error) {
      res.status(500).json({ mensaje: 'Error al crear el movimiento', error });
    } else {
      res.status(201).json({ id: results.insertId, mensaje: 'Movimiento creado exitosamente' });
    }
  });
});

// READ - Obtener todos los movimientos
router.get('/', (req, res) => {
  conexion.query('SELECT * FROM movimientos', (error, results) => {
    if (error) {
      res.status(500).json({ mensaje: 'Error al obtener los movimientos', error });
    } else {
      res.json(results);
    }
  });
});

// READ - Obtener un movimiento específico por ID
router.get('/:id', (req, res) => {
  conexion.query('SELECT * FROM movimientos WHERE id = ?', [req.params.id], (error, results) => {
    if (error) {
      res.status(500).json({ mensaje: 'Error al obtener el movimiento', error });
    } else if (results.length === 0) {
      res.status(404).json({ mensaje: 'Movimiento no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
});

// UPDATE - Actualizar un movimiento existente
router.put('/:id', (req, res) => {
  const { tipo, monto, descripcion, fecha_solicitud, fecha_desembolso } = req.body;
  const query = 'UPDATE movimientos SET tipo = ?, monto = ?, descripcion = ?, fecha_solicitud = ?, fecha_desembolso = ?  WHERE id = ?';
  const values = [tipo, monto, descripcion, fecha_solicitud, fecha_desembolso, req.params.id];

  conexion.query(query, values, (error, results) => {
    if (error) {
      res.status(500).json({ mensaje: 'Error al actualizar el movimiento', error });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ mensaje: 'Movimiento no encontrado' });
    } else {
      res.json({ mensaje: 'Movimiento actualizado exitosamente' });
    }
  });
});

// DELETE - Eliminar un movimiento
router.patch('/:id', (req, res) => { 
  const query = `UPDATE movimientos SET eliminado = CASE WHEN eliminado = '1' THEN '0' ELSE '1' END WHERE id = ?`;
  conexion.query(query, [req.params.id], (error, results) => {
    if (error) {
      res.status(500).json({ mensaje: 'Error al actualizar el estado del movimiento', error });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ mensaje: 'Movimiento no encontrado' });
    } else {
      res.json({ mensaje: 'Estado del movimiento actualizado exitosamente' });
    }
  });
});
  
  module.exports = router;