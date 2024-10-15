var express = require('express');
var router = express.Router();
var connection = require('../database');

// CRUD FAQ (<ARUHIZA>)



router.get('/', function (req, res, next) {
    const query = 'SELECT * FROM faq;';

    connection.query(query, function (error, results, fields) {
        if (error) {
            return res.status(500).json({
                error: error,
                message: 'ERRO AL RECIBIR FAQs',
            });
        }

        res.status(200).json({
            data: results,
            message: 'FAQs RECIBIDO CON EXITO',
        });
    });
});


router.post('/', function (req, res, next) {
    const { pregunta, respuesta, estado } = req.body;

    const query = 'INSERT INTO faq (pregunta, respuesta, estado) VALUES (?, ?, ?);';

    connection.query(query, [pregunta, respuesta, estado], function (error, results, fields) {
        if (error) {
            return res.status(500).json({
                error: error,
                message: 'ERROR AL CREAR FAQ',
            });
        }

        res.status(201).json({
            message: 'FAQ CREADO CON EXITO',
        });
    });
});

router.put('/:id', function (req, res, next) {
    const { pregunta, respuesta, estado } = req.body;
    const postId = req.params.id;

    const query = 'UPDATE faq SET pregunta = ?, respuesta = ?, estado = ? WHERE id = ?;';

    connection.query(query, [pregunta, respuesta, estado, postId], function (error, results, fields) {
        if (error) {
            return res.status(500).json({
                error: error,
                message: 'ERROR AL ACTUALIZAR FAQ',
            });
        }

        res.status(200).json({
            message: 'FAQ ACTUALIZADO CON EXITO',
        });
    });
});



router.delete('/:id', function (req, res, next) {
    const postId = req.params.id; // Obtener el ID del post

    // const query = `SELECT imagen_portada FROM posts WHERE id = "${postId}";`;

    // // Obtener la información del post
    // connection.query(query, function (error, results, fields) {
    //     if (error) {
    //         return res.status(500).json({
    //             error: error,
    //             message: 'ERROR AL RECUPERAR LA INFORMACION',
    //         });
    //     }

    //     // Verificar si el post existe
    //     if (results.length === 0) {
    //         return res.status(404).json({
    //             message: 'FAQ NO ENCONTRADO',
    //         });
    //     }

    //     const currentPost = results[0];
    //     const imagen_portada = currentPost.imagen_portada;

    //     // Eliminar la imagen si existe
    //     if (imagen_portada) {
    //         const imagePath = path.join(__dirname, '..', imagen_portada);
    //         fs.unlink(imagePath, (err) => {
    //             if (err) {
    //                 console.error('ERROR AL ELIMINAR FAQ:', err);
    //             }
    //         });
    //     }

        // Eliminar el post de la base de datos
        const query2 = `DELETE FROM posts WHERE id = "${postId}";`;
        connection.query(query2, function (error, results, fields) {
            if (error) {
                return res.status(500).json({
                    error: error,
                    message: 'ERROR AL ELIMINAR FAQ',
                });
            }

            res.status(200).json({
                message: 'FAQ ELIMINADO OCN EXITO',
            });
        });
    });
//});


module.exports = router;