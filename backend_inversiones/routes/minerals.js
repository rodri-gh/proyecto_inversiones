import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import Mineral from '../models/mineralModel.js';
import { verifyIfIdExists } from '../helpers/handleId.js';


const router = express.Router();
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

router.get('/', async (req, res, next) => {
  // const query = 'SELECT * FROM minerals;';
  // connection.query(query, function (error, results, fields) {
  //   if (error) {
  //     console.log(error);
  //     res.status(500).json({
  //       error: error,
  //       message: 'Error in the query',
  //     });
  //   } else {
  //     console.log(results);
  //     // para mostrar imagenes de la base de datos
  //     results.forEach(element => {
  //       if (element.image) {
  //         element.image = `http://localhost:3000/images/minerals/${element.image}`;
  //       }
  //     })
  //     res.status(200).json({
  //       data: results,
  //       message: 'Listing minerals',
  //     });
  //   }
  // });
  try {
    const minerals = await Mineral.findAll();
    getHandleSuccess(200)(res, minerals);
  } catch (error) {
    getHandleError(error, res)
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const minerals = await Mineral.findAll({ where: { id: id }});
    getHandleSuccess(200)(res, minerals);
  } catch (error) {
    getHandleError(error, res)
  }
});

router.post('/', upload.single('image'), async (req, res, next) => {
  const { name, price, description } = req.body;
  const image = req.file ? `${req.file.filename}` : null;
  try {
    await Mineral.create({ name, price, description, image });
    getHandleSuccess(201)(res, "Mineral created successfully");
  } catch (error) {
    getHandleError(error, res);
  }
});

router.put('/:id', upload.single('image'), function (req, res, next) {
  const mineralId = req.params.id;
  const { name, description, price } = req.body;

  const query = `SELECT image FROM minerals WHERE id = "${mineralId}";`;
  connection.query(query, function (error, results, fields) {
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

    connection.query(query, (error, results) => {
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

router.delete('/:id', async (req, res, next) =>{
  const { id } = req.params;
  try {
    const [mineralDeleted] = await Mineral.update({ deleted: true }, { where: { id } });
    verifyIfIdExists(mineralDeleted);
    getHandleSuccess(204)(res, "Mineral created successfully");
  } catch (error) {
    getHandleError(error, res);
  }
});

export default router;
