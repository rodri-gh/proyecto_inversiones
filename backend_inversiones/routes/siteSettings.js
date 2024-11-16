import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import SiteSetting from '../models/siteSettingModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const uploadDir = 'public/images/site_settings';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Obtener configuración del sitio
router.get('/', async (req, res, next) => {
  try {
    const settings = await SiteSetting.findAll();
    settings.forEach(setting => {
      if (setting.logo) {
        setting.logo = `http://localhost:3000/images/site_settings/${setting.logo}`;
      }
      if (setting.aboutImage) {
        setting.aboutImage = `http://localhost:3000/images/site_settings/${setting.aboutImage}`;
      }
    });
    getHandleSuccess(200)(res, settings);
  } catch (error) {
    getHandleError(error, res);
  }
});

// Crear configuración del sitio
router.post('/', upload.fields([{ name: 'logo' }, { name: 'about_image' }]), async (req, res, next) => {
  const {
    name, homeTitle, homeText, aboutTitle, aboutText, facebook, instagram, tiktok, x,
    phone, whatsapp, email, address, businessHours, dataPolicyLink, termsConditionsLink
  } = req.body;

  const logo = req.files['logo'] ? req.files['logo'][0].filename : null;
  const aboutImage = req.files['about_image'] ? req.files['about_image'][0].filename : null;

  try {
    await SiteSetting.create({
      logo, name, homeTitle, homeText, aboutTitle, aboutText, aboutImage,
      facebook, instagram, tiktok, x, phone, whatsapp, email, address, businessHours,
      dataPolicyLink, termsConditionsLink
    });
    getHandleSuccess(201)(res, "Site settings created successfully");
  } catch (error) {
    getHandleError(error, res);
  }
});

// Editar configuración del sitio
router.put('/:id', upload.fields([{ name: 'logo' }, { name: 'about_image' }]), async (req, res, next) => {
  const { id } = req.params;
  const {
    name, homeTitle, homeText, aboutTitle, aboutText, facebook, instagram, tiktok, x,
    phone, whatsapp, email, address, businessHours, dataPolicyLink, termsConditionsLink
  } = req.body;

  try {
    const setting = await SiteSetting.findOne({ where: { id } });
    if (!setting) {
      return getHandleError(new Error('Site setting not found'), res);
    }

    let logo = setting.logo;
    let aboutImage = setting.aboutImage;

    if (req.files['logo']) {
      logo = req.files['logo'][0].filename;
      if (setting.logo) {
        const oldLogoPath = path.join(__dirname, '../public/images/site_settings', setting.logo);
        fs.access(oldLogoPath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldLogoPath, (err) => {
              if (err) {
                console.error('Error deleting old logo:', err);
              }
            });
          }
        });
      }
    }

    if (req.files['about_image']) {
      aboutImage = req.files['about_image'][0].filename;
      if (setting.aboutImage) {
        const oldAboutImagePath = path.join(__dirname, '../public/images/site_settings', setting.aboutImage);
        fs.access(oldAboutImagePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldAboutImagePath, (err) => {
              if (err) {
                console.error('Error deleting old about image:', err);
              }
            });
          }
        });
      }
    }

    await SiteSetting.update(
      {
        logo, name, homeTitle, homeText, aboutTitle, aboutText, aboutImage,
        facebook, instagram, tiktok, x, phone, whatsapp, email, address, businessHours,
        dataPolicyLink, termsConditionsLink
      },
      { where: { id } }
    );

    getHandleSuccess(200)(res, 'Site settings updated successfully');
  } catch (error) {
    getHandleError(error, res);
  }
});

// Eliminar configuración del sitio
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const setting = await SiteSetting.findOne({ where: { id } });
    if (!setting) {
      return getHandleError(new Error('Site setting not found'), res);
    }

    if (setting.logo) {
      const logoPath = path.join(__dirname, '../public/images/site_settings', setting.logo);
      fs.access(logoPath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(logoPath, (err) => {
            if (err) {
              console.error('Error deleting logo:', err);
            }
          });
        }
      });
    }

    if (setting.aboutImage) {
      const aboutImagePath = path.join(__dirname, '../public/images/site_settings', setting.aboutImage);
      fs.access(aboutImagePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(aboutImagePath, (err) => {
            if (err) {
              console.error('Error deleting about image:', err);
            }
          });
        }
      });
    }

    await SiteSetting.destroy({ where: { id } });
    getHandleSuccess(200)(res, 'Site setting deleted successfully');
  } catch (error) {
    getHandleError(error, res);
  }
});

export default router;