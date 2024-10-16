var express = require('express');
var router = express.Router();
var connection = require('../database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegurar que el directorio donde se guardaran las imagenes existe
const uploadDir = 'public/images/withdrawalRequests';
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
    }
})

const upload = multer({ storage: storage })

router.get('/', function(req, res, next) {
    var query = `SELECT * FROM solicitudes_retiro`;

    connection.query(query, function (error, result, fields) {
        if (error){
            console.log(error);
            res.status(500).send({
                error: error,
                message: "Error in the query"
            });
        }else{
            console.log(result);
            result.forEach(element => {
                if (element.foto_dni) {
                    element.foto_dni = `http://localhost:3000/images/withdrawalRequests/${element.foto_dni}`;
                }
                if (element.selfie_dni) {
                    element.selfie_dni = `http://localhost:3000/images/withdrawalRequests/${element.selfie_dni}`;
                }
            })
            res.status(200).send({
                data: result,
                message: "Successful petition"
            })
        }
    });
})

router.post('/', upload.fields([{ name: 'foto_dni' }, { name: 'selfie_dni' }]), function(req, res, next) {
    const {tipo, usuario_id, monto_solicitud, comision_aplicar, monto_a_recibir, fecha_solicitud, fecha_aprobacion, estado, inversion_id, eliminado} = req.body;

    const foto_dni  = req.files['foto_dni'] ? `${req.files['foto_dni'][0].filename}` : null;
    const selfie_dni  = req.files['selfie_dni'] ? `${req.files['selfie_dni'][0].filename}` : null;

    var query = `INSERT INTO solicitudes_retiro(tipo, usuario_id, monto_solicitud, comision_aplicar, monto_a_recibir, fecha_solicitud, fecha_aprobacion, foto_dni, selfie_dni, estado, inversion_id, eliminado)
    VALUES('${tipo}', '${usuario_id}', '${monto_solicitud}', '${comision_aplicar}', '${monto_a_recibir}', '${fecha_solicitud}', '${fecha_aprobacion}', '${foto_dni}', '${selfie_dni}', '${estado}', '${inversion_id}', '${eliminado}')`;

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

router.put('/:id', upload.fields([{ name: 'foto_dni' }, { name: 'selfie_dni' }]), function(req, res, next) {
    const withdrawalRequestsId = req.params.id;
    const {tipo, usuario_id, monto_solicitud, comision_aplicar, monto_a_recibir, fecha_solicitud, fecha_aprobacion, estado, inversion_id, eliminado} = req.body;


    const query = `SELECT foto_dni, selfie_dni FROM solicitudes_retiro WHERE id = ${withdrawalRequestsId}`;
    connection.query(query, function (error, result, fields) {
        if (error){
            console.log(error);
            res.status(500).send({
                error: error,
                message: "Error in the query"
            });
        }else{
            const currentWithdrawalRequests = result[0];
            
            let foto_dni = currentWithdrawalRequests.foto_dni;
            let selfie_dni = currentWithdrawalRequests.selfie_dni;

            if(req.files){
                foto_dni = `${req.files['foto_dni'][0].filename}`;
                selfie_dni = `${req.files['selfie_dni'][0].filename}`;

                if(currentWithdrawalRequests.foto_dni){
                    const oldImagePath = 'public/images/withdrawalRequests/' + currentWithdrawalRequests.foto_dni;
                    fs.unlink(oldImagePath, (err) => {
                        console.log('Error deleting old image: ', err);
                    });
                }

                if(currentWithdrawalRequests.selfie_dni){
                    const oldImagePath = 'public/images/withdrawalRequests/' + currentWithdrawalRequests.selfie_dni;
                    fs.unlink(oldImagePath, (err) => {
                        console.log('Error deleting old image: ', err);
                    });
                }
            }

    const query = `UPDATE solicitudes_retiro SET
    tipo = '${tipo}',
    usuario_id = '${usuario_id}',
    monto_solicitud = '${monto_solicitud}',
    comision_aplicar = '${comision_aplicar}',
    monto_a_recibir = '${monto_a_recibir}',
    fecha_solicitud = '${fecha_solicitud}',
    fecha_aprobacion = '${fecha_aprobacion}',
    foto_dni = '${foto_dni}',
    selfie_dni = '${selfie_dni}',
    estado = '${estado}',
    inversion_id = '${inversion_id}',
    eliminado = '${eliminado}'
    WHERE id = ${withdrawalRequestsId}`;

    connection.query(query, function (error, result, fields) {
        if (error){
            console.log(error);
            return res.status(500).send({
                error: error,
                message: "Error in the query"
            });
        }
            res.status(200).send({
                data: result,
                message: "Successfully updated information"
            })
        });
        }
    });
});

router.delete('/:id', function(req, res, next) {
    const withdrawalRequestsId = req.params.id;

    const query2 = `SELECT foto_dni, selfie_dni FROM solicitudes_retiro WHERE id = ${withdrawalRequestsId}`;
    connection.query(query2, function (error, result, fields) {
        if (error){
            console.log(error);
            res.status(500).send({
                error: error,
                message: "Error al realizar la peticion"
            });
        }
    if(result.length === 0){
        return res.status(404).json({
            message: "Information not found"
        });
    }

    const currentWithdrawalRequests = result[0];
    const foto_dni = currentWithdrawalRequests.foto_dni;
    const selfie_dni = currentWithdrawalRequests.selfie_dni;

    if(foto_dni){
        const imagePath = path.join(__dirname, '..', foto_dni);
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.log('Error deleting image: ', err);
            }
        });
    }

    if(selfie_dni){
        const imagePath = path.join(__dirname, '..', selfie_dni);
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.log('Error deleting image: ', err);
            }
        });
    }

    const query = `DELETE FROM solicitudes_retiro WHERE id = ${withdrawalRequestsId}`;

    connection.query(query, function (error, result, fields) {
        if (error){
            console.log(error);
            return res.status(500).send({
                error: error,
                message: "Error in the query"
            });
        }
            res.status(200).send({
                message: "Information successfully deleted"
            });
        });
    });
});

router.put('/state/:id', function(req, res, next) {
    const { id } = req.params;

    const query = `UPDATE solicitudes_retiro SET estado = CASE WHEN estado = 'Pendiente' THEN 'Aprobado' ELSE 'Pendiente' END  WHERE id = ${id}`;

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
                message: "Successful petition"
            })
        }
    });
});

router.patch('/:id', (req, res) => {
    const query = `UPDATE solicitudes_retiro SET eliminado = CASE WHEN eliminado = '1' THEN '0' ELSE '1' END WHERE id = ?`;
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