var express = require('express');
var router = express.Router();
const conexion = require('../database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegurar que el directorio donde se guardaran las imagenes existe
const uploadDir = 'public/documents';
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
});

const upload = multer({ storage: storage });

router.get('/', function (req, res, next) {
    const query = 'SELECT * FROM contracts;';
    conexion.query(query, function (error, results, fields) {
      if (error) {
        console.log(error);
        res.status(500).json({
          error: error,
          message: 'Error in the query',
        });
      } else {
        console.log(results);
        // para mostrar imagenes de la base de datos
        results.forEach(element => {
          if (element.contract_file_path) {
            element.contract_file_path = `http://localhost:3000/documents/${element.contract_file_path}`;
          }
        })
        res.status(200).json({
          data: results,
          message: 'Listing contracts',
        });
      }
    });
});

router.post('/', upload.single('contract_file_path'), function (req, res, next) {
    const { project_id, user_id, investment_id, contract_code, contract_date, } = req.body;

  
    const contract_file_path = req.file ? `${req.file.filename}` : null;
  
    const query = `
      INSERT INTO contracts (project_id,user_id,investment_id,contract_code,contract_date, contract_file_path)
      VALUES ("${project_id}","${user_id}","${investment_id}", "${contract_code}", "${contract_date}", "${contract_file_path}");
    `;
  
    conexion.query(query, function (error, results, fields) {
      if (error) {
        console.log(error);
        res.status(500).json({
          error: error,
          message: 'Error in the query',
        });
      } else {
        console.log(results);
        res.status(200).json({
          data: results,
          message: 'Contract created',
        });
      }
    });
});

router.put('/:id', upload.single('contract_file_path'), function (req, res, next) {
    const contractId = req.params.id;
    const { project_id, user_id, investment_id, contract_code, contract_date, contract_file_path } = req.body;
  
    const query = `SELECT contract_file_path FROM contracts WHERE id = "${contractId}";`;
    conexion.query(query, function (error, results, fields) {
      if (error) {
        console.error(error);
        return res.status(500).json({
          error: error,
          message: 'Error retrieving contracts information',
        });
      }
  
      const currentContract = results[0];
  
  
      let contract_file_path = currentContract.contract_file_path;
      if (req.file) {
        // Si se subió un nuevo documento, actualizar la ruta
        contract_file_path = `${req.file.filename}`;
  
        // Eliminar el documento antiguo si existe
        if (currentContract.contract_file_path) {
          const oldImagePath = path.join(__dirname, '../public/documents', currentContract.contract_file_path);
          fs.unlink(oldImagePath, (err) => {
            console.error('Error deleting old document:', err);
          });
        }
      }
  
      const query = `
        UPDATE contracts 
        SET project_id = "${project_id}", user_id = "${user_id}", investment_id = "${investment_id}", contract_code = "${contract_code}", contract_date = "${contract_date}", contract_file_path = "${contract_file_path}"
        WHERE id = "${contractId}";
      `;
  
      conexion.query(query, (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({
            error: error,
            message: 'Error updating contract',
          });
        }
  
        res.status(200).json({
          message: 'Contract updated',
        });
      });
    });
});

router.patch('/:id', function (req, res, next) {
  const contractId = req.params.id;

  const query = `UPDATE minerals SET deleted = !deleted WHERE id = "${contractId}";`;
  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.error(error);
      return res.status(500).json({
        error: error,
        message: 'Error deleting contract',
      });
    }
    res.status(200).json({
      message: 'Contract deleted',
    });
  });
});



module.exports = router;