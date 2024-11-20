import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import Mineral from '../models/mineralModel.js';
import dotenv from 'dotenv';
import { verifyIfIdExists } from '../helpers/handleId.js';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  try {
    const minerals = await Mineral.findAll();
    minerals.forEach(mineral => {
      if (mineral.image) {
        mineral.image = `${process.env.URL_BASE}/images/minerals/${mineral.image}`;
      }
    });
    getHandleSuccess(200)(res, minerals);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const minerals = await Mineral.findAll({ where: { id: id } });
    getHandleSuccess(200)(res, minerals);
  } catch (error) {
    getHandleError(error, res);
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

router.put('/:id', upload.single('image'), async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    const mineral = await Mineral.findOne({ where: { id } });
    if (!mineral) {
      return getHandleError(new Error('Mineral not found'), res);
    }

    let image = mineral.image;
    if (req.file) {
      // Si se subió una nueva imagen, actualizar la ruta
      image = `${req.file.filename}`;

      // Eliminar la imagen antigua si existe
      if (mineral.image) {
        const oldImagePath = path.join(__dirname, '../public/images/minerals', mineral.image);
        fs.access(oldImagePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldImagePath, (err) => {
              if (err) {
                console.error('Error deleting old image:', err);
              }
            });
          } else {
            console.error('Old image not found:', oldImagePath);
          }
        });
      }
    }


    await Mineral.update(
      { name, description, price, image },
      { where: { id } }
    );

    getHandleSuccess(200)(res, 'Mineral updated successfully');
  } catch (error) {
    getHandleError(error, res);
  }
});

router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const mineral = await Mineral.findOne({ where: { id } });
    if (!mineral) {
      return getHandleError(new Error('Mineral not found'), res);
    }

    const newDeletedStatus = mineral.deleted ? 0 : 1;
    await Mineral.update({ deleted: newDeletedStatus }, { where: { id } });

    getHandleSuccess(200)(res, `Mineral ${newDeletedStatus ? 'deleted' : 'restored'} successfully`);
  } catch (error) {
    getHandleError(error, res);
  }
});

export default router;
