import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getHandleSuccess } from '../helpers/handleSuccess.js';
import { getHandleError } from '../helpers/handleExceptions.js';
import Post from '../models/postModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const uploadDir = 'public/images/posts';
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
    const posts = await Post.findAll();
    posts.forEach(post => {
      if (post.cover_image) {
        post.cover_image = `https://apiminerales.pruebasdeploy.online/images/posts/${post.cover_image}`;
      }
    });
    getHandleSuccess(200)(res, posts);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      return getHandleError(new Error('Post not found'), res);
    }
    if (post.cover_image) {
      post.cover_image = `https://apiminerales.pruebasdeploy.online/images/posts/${post.cover_image}`;
    }
    getHandleSuccess(200)(res, post);
  } catch (error) {
    getHandleError(error, res);
  }
});

router.post('/', upload.single('cover_image'), async (req, res, next) => {
  const { category_post_id, user_id, title, summary, content } = req.body;
  const cover_image = req.file ? `${req.file.filename}` : null;
  try {
    await Post.create({ category_post_id, user_id, title, summary, cover_image, content });
    getHandleSuccess(201)(res, "Post created successfully");
  } catch (error) {
    getHandleError(error, res);
  }
});

router.put('/:id', upload.single('cover_image'), async (req, res, next) => {
  const { id } = req.params;
  const { category_post_id, user_id, title, summary, content } = req.body;

  try {
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      return getHandleError(new Error('Post not found'), res);
    }

    let cover_image = post.cover_image;
    if (req.file) {
      cover_image = `${req.file.filename}`;
      if (post.cover_image) {
        const oldImagePath = path.join(__dirname, '../public/images/posts', post.cover_image);
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

    await Post.update(
      { category_post_id, user_id, title, summary, cover_image, content },
      { where: { id } }
    );

    getHandleSuccess(200)(res, 'Post updated successfully');
  } catch (error) {
    getHandleError(error, res);
  }
});

router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      return getHandleError(new Error('Post not found'), res);
    }

    const newStatus = !post.status;
    await Post.update({ status: newStatus }, { where: { id } });

    getHandleSuccess(200)(res, `Post ${newStatus ? 'restored' : 'deleted'} successfully`);
  } catch (error) {
    getHandleError(error, res);
  }
});

export default router;
