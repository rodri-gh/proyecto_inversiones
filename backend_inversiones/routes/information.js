var express = require('express');
var router = express.Router();
var connection = require('../database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegurar que el directorio donde se guardaran las imagenes existe
const uploadDir = 'public/images/information';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de Multer
const storage = multer.diskStorage({
destination: function (req, file, cb) {
    cb(null, uploadDir)
},
filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
    },
});

const upload = multer({ storage: storage });

router.get('/', function(req, res, next) {
    var query = `SELECT * FROM informacion`;

    connection.query(query, function (error, result, fields) {
        if (error){
            console.log(error);
            res.status(500).send({
                error: error,
                message: "Error in the query"
            });
        }else{
            console.log(result);
            // para mostrar imagenes de la base de datos 
            result.forEach(element => {
                if (element.imagen) {
                    element.imagen = `http://localhost:3000/images/information/${element.imagen}`;
                }
            })
            res.status(200).send({
                data: result,
                message: "Successful petition"
            })
        }
    }); 
});

router.post('/', upload.single('imagen'), function(req, res, next) {
    const {cliente_id, nombre, codigo, categoria_mineral_id, descripcion, monto_inversion, cantidad_maxima_inversiones, vision} = req.body;

    // Obtener la ruta de la imagen subida, quitar el directorio y dejar solo el nombre de la imagen, para ahorrar memoria
    const imagen = req.file ? `${req.file.filename}` : null;

    var query = `INSERT INTO informacion(cliente_id, nombre, codigo, imagen, categoria_mineral_id, descripcion, monto_inversion, cantidad_maxima_inversiones, vision) VALUES('${cliente_id}', '${nombre}', '${codigo}', '${imagen}', '${categoria_mineral_id}', '${descripcion}', '${monto_inversion}', '${cantidad_maxima_inversiones}', '${vision}')`;

    connection.query(query, function (error, result, fields) {
        if (error){
            console.log(error);
            res.status(500).send({
                error: error,
                message: "Error in the query"
            });
        }else{
            console.log(result);
            res.status(200).send({
                data: result,
                message: "Successful registration"
            })
        }
    });
});

router.put('/:id', upload.single('imagen'), function(req, res, next) {
    const informationId = req.params.id;
    const {cliente_id, nombre, codigo, categoria_mineral_id, descripcion, monto_inversion, cantidad_maxima_inversiones, vision} = req.body;

    const query = `SELECT imagen FROM informacion WHERE id = ${informationId}`;
    connection.query(query, function (error, result, fields) {
    if (error){
            console.log(error);
            return res.status(500).json({
                error:error,
                message: "Error retrieving information"
            });
    }else{
        const currentInformation = result[0];

    let imagen = currentInformation.imagen;
    if (req.file) {
        // Si se subio una nueva imagen, actualizar la ruta
        imagen = `${req.file.filename}`;

        // Eliminar la imagen antigua si existe
        if (currentInformation.imagen) {
            //const oldImagePath = path.join(__dirname, '..', currentInformation.imagen);
            const oldImagePath = 'public/images/information/' + currentInformation.imagen;
            fs.unlink(oldImagePath, (err) => {
                console.log('Error deleting old image: ', err);
            });
        }
    } 

    var query = `UPDATE informacion SET
                cliente_id = '${cliente_id}',
                nombre = '${nombre}',
                codigo = '${codigo}',
                imagen = '${imagen}',
                categoria_mineral_id = '${categoria_mineral_id}',
                descripcion = '${descripcion}',
                monto_inversion = '${monto_inversion}',
                cantidad_maxima_inversiones = '${cantidad_maxima_inversiones}',
                vision = '${vision}'
                WHERE id = ${informationId}`;
        connection.query(query, function (error, result, fields) {
            if (error){
                console.log(error);
                return res.status(500).json({
                    error: error,
                    message: "Error in the query"
                });
            }

            res.status(200).json({
                message: "Successfully updated information",
            });
        });
    }
    });
});

router.delete('/:id', function(req, res, next) {
    const informationId = req.params.id;

    const query = `SELECT imagen FROM informacion WHERE id = ${informationId}`;

    //Obtener la informacion del information para verificar si tiene una imagen asociada
    connection.query(query, function (error, result, fields) {
        if (error){
            console.log(error);
            return res.status(500).json({
                error:error,
                message: "Error retrieving information"
            });
        }
    
    // verificar si se encontro information
    if(result.length === 0) {
        return res.status(404).json({
            message: "Information not found"
        });
    }

    const currentInformation = result[0];
    const imagen = currentInformation.imagen;

    //Eliminar la imagen si existe
    if (imagen) {
        const imagePath = path.join(__dirname, '..', imagen);
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.log('Error deleting image: ', err);
            }
        });
    }

    //eliminar la informacion de la base de datos
    var query2 = `DELETE FROM informacion WHERE id = ${informationId}`;
        connection.query(query2, function (error, result, fields) {
            if (error){
                console.log(error);
                return res.status(500).json({
                    error: error,
                    message: "Error in the query"
                });
            }

            res.status(200).json({
                message: "Information successfully deleted",
            });
        });
    });
});

router.patch('/:id', (req, res) => {
    const query = `UPDATE informacion SET eliminado = CASE WHEN eliminado = '1' THEN '0' ELSE '1' END WHERE id = ?`;
    connection.query(query, [req.params.id], (error, results) => {
        if (error) {
            res.status(500).json({ mensaje: 'Error updating motion status', error });
        }else if (results.affectedRows === 0) {
            res.status(404).json({ mensaje: 'Movement not found' });
        } else {
            res.status(200).json({ mensaje: 'Movement successfully updated' });
        }
    })
})

module.exports = router;