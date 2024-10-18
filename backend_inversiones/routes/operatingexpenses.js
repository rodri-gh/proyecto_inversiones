var express = require('express');
var router = express.Router();
var connection = require('../database');

router.get('/', (req, res) => {
    const query = `
      SELECT oe.id, oe.name, oe.description, oe.expenses, p.name AS project_name 
      FROM operating_expenses oe
      JOIN projects p ON oe.project_id = p.id;`;

    connection.query(query, function (error, results) {
        if (error) {
            return res.status(500).json({ error: error, message: 'Error en la consulta' });
        }
        res.status(200).json(results);
    });
});


router.post('/', (req, res) => {
    const { name, description, expenses, project_id } = req.body;

    const query = 'INSERT INTO operating_expenses (name, description, expenses, project_id) VALUES (?, ?, ?, ?);';

    connection.query('SELECT id FROM projects WHERE id = ?', [project_id], function (err, projectResults) {
        if (err || projectResults.length === 0) {
            return res.status(400).json({ message: 'Project ID no existe' });
        }

        connection.query(query, [name, description, expenses, project_id], function (error, results) {
            if (error) {
                return res.status(500).json({ error: error, message: 'Error en la consulta' });
            }
            res.status(201).json({ message: 'Registro creado exitosamente' });
        });
    });
});


router.put('/:id', (req, res) => {
    const { name, description, expenses, project_id } = req.body;
    const id = req.params.id;

    const query = 'UPDATE operating_expenses SET name = ?, description = ?, expenses = ?, project_id = ? WHERE id = ?';

    connection.query('SELECT id FROM projects WHERE id = ?', [project_id], function (err, projectResults) {
        if (err || projectResults.length === 0) {
            return res.status(400).json({ message: 'Project ID no existe' });
        }

        connection.query(query, [name, description, expenses, project_id, id], function (error, results) {
            if (error) {
                return res.status(500).json({ error: error, message: 'Error en la consulta' });
            }
            res.status(200).json({ message: 'Registro actualizado exitosamente' });
        });
    });
});





// router.patch('/operating_expenses/:id', (req, res) => {
//     const { name, description, expenses, project_id } = req.body;
//     const id = req.params.id;

//     const query = 'UPDATE operating_expenses SET name = COALESCE(?, name), description = COALESCE(?, description), expenses = COALESCE(?, expenses), project_id = COALESCE(?, project_id) WHERE id = ?';

//     connection.query('SELECT id FROM projects WHERE id = ?', [project_id], function (err, projectResults) {
//         if (err || projectResults.length === 0) {
//             return res.status(400).json({ message: 'Project ID no existe' });
//         }

//         connection.query(query, [name, description, expenses, project_id, id], function (error, results) {
//             if (error) {
//                 return res.status(500).json({ error: error, message: 'Error en la consulta' });
//             }
//             res.status(200).json({ message: 'Registro actualizado parcialmente' });
//         });
//     });
// });



router.patch('/:id', (req, res) => {
    const id = req.params.id;
    const { name, description, expenses, project_id } = req.body;
    let updateFields = [];
    let values = [];

    const query = `UPDATE operating_expenses SET ${updateFields.join(', ')} WHERE id = ?`;

    // Validar que el `project_id` es válido si está presente
    if (project_id) {
        connection.query('SELECT id FROM projects WHERE id = ?', [project_id], function (err, projectResults) {
            if (err || projectResults.length === 0) {
                return res.status(400).json({ message: 'Project ID no existe' });
            }

            // Ejecutar la consulta de actualización
            connection.query(query, values, function (error, results) {
                if (error) {
                    return res.status(500).json({ error: error, message: 'Error en la consulta' });
                }
                res.status(200).json({ message: 'Registro actualizado parcialmente' });
            });
        });
    } else {
        // Si no hay project_id, ejecuta la actualización sin validación
        connection.query(query, values, function (error, results) {
            if (error) {
                return res.status(500).json({ error: error, message: 'Error en la consulta' });
            }
            res.status(200).json({ message: 'Registro actualizado parcialmente' });
        });
    }
});




module.exports = router