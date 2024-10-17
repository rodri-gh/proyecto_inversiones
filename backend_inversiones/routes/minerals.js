var express = require('express');
var router = express.Router();
const conexion = require('../database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegurar que el directorio donde se guardaran las imagenes existe
const uploadDir = 'public/images/minerals';
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
  const query = 'SELECT * FROM minerals WHERE deleted = 1;';
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
        if (element.image) {
          element.image = `http://localhost:3000/images/minerals/${element.image}`;
        }
      })
      res.status(200).json({
        data: results,
        message: 'Listing minerals',
      });
    }
  });
});

router.post('/', upload.single('image'), function (req, res, next) {
  const { name, price, description } = req.body;



  const image = req.file ? `${req.file.filename}` : null;

  const query = `
    INSERT INTO minerals (name,price,description,image) 
    VALUES ("${name}","${price}","${description}","${image}");
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
        message: 'Mineral created',
      });
    }
  });
});

router.put('/:id', upload.single('image'), function (req, res, next) {
  const mineralId = req.params.id;
  const { name, description, price } = req.body;

  const query = `SELECT image FROM minerals WHERE id = "${mineralId}";`;
  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.error(error);
      return res.status(500).json({
        error: error,
        message: 'Error retrieving minerals information',
      });
    }

    const currentMineral = results[0];


    let image = currentMineral.image;
    if (req.file) {
      // Si se subió una nueva imagen, actualizar la ruta
      image = `${req.file.filename}`;

      // Eliminar la imagen antigua si existe
      if (currentMineral.image) {
        const oldImagePath = path.join(__dirname, '../public/images/minerals', currentMineral.image);
        fs.unlink(oldImagePath, (err) => {
          console.error('Error deleting old image:', err);
        });
      }
    }

    const query = `
      UPDATE minerals 
      SET name = "${name}", description = "${description}", price = "${price}", image = "${image}"
      WHERE id = "${mineralId}";
    `;

    conexion.query(query, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          error: error,
          message: 'Error updating mineral',
        });
      }

      res.status(200).json({
        message: 'Mineral updated',
      });
    });
  });
});

router.patch('/:id', function (req, res, next) {
  const mineralId = req.params.id;

  const query = `UPDATE minerals SET deleted = !deleted WHERE id = "${mineralId}";`;
  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.error(error);
      return res.status(500).json({
        error: error,
        message: 'Error deleting mineral',
      });
    }
    res.status(200).json({
      message: 'Mineral deleted',
    });
  });
});

module.exports = router;