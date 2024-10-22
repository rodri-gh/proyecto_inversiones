var express = require('express');
var router = express.Router();
const conexion = require('../database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegurar que el directorio donde se guardaran las imagenes existe
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

router.get('/', function (req, res, next) {
  const query = 'SELECT * FROM posts';
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
        if (element.cover_image) {
          element.cover_image = `http://localhost:3000/images/posts/${element.cover_image}`;
        }
      })
      res.status(200).json({
        data: results,
        message: 'Listing posts',
      });
    }
  });
});

router.post('/', upload.single('cover_image'), function (req, res, next) {
  const { category_post_id, user_id, title, summary, content } = req.body;

  const cover_image = req.file ? `${req.file.filename}` : null;

  const query = `
    INSERT INTO posts (category_post_id, user_id, title, summary, cover_image, content) 
    VALUES ("${category_post_id}", "${user_id}", "${title}", "${summary}", "${cover_image}", "${content}");
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
        message: 'Post created',
      });
    }
  });
});

router.put('/:id', upload.single('cover_image'), function (req, res, next) {
  const postId = req.params.id;
  const { category_post_id, user_id, title, summary, content } = req.body;

  const query = `SELECT cover_image FROM posts WHERE post_id = "${postId}";`;
  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.error(error);
      return res.status(500).json({
        error: error,
        message: 'Error retrieving post information',
      });
    }

    const currentPost = results[0];

    let cover_image = currentPost.cover_image;
    if (req.file) {
      // Si se subió una nueva imagen, actualizar la ruta
      cover_image = `${req.file.filename}`;

      // Eliminar la imagen antigua si existe
      if (currentPost.cover_image) {
        const oldImagePath = path.join(__dirname, '../public/images/posts', currentPost.cover_image);
        fs.unlink(oldImagePath, (err) => {
          console.error('Error deleting old image:', err);
        });
      }
    }

    const query = `
      UPDATE posts 
      SET category_post_id = "${category_post_id}", user_id = "${user_id}", title = "${title}", summary = "${summary}", cover_image = "${cover_image}", content = "${content}"
      WHERE post_id = "${postId}";
    `;

    conexion.query(query, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          error: error,
          message: 'Error updating post',
        });
      }

      res.status(200).json({
        message: 'Post updated',
      });
    });
  });
});

router.patch('/:id', function (req, res, next) {
  const postId = req.params.id;
  // Cambiar el campo de eliminado del post de 1 a 0 o de 0 a 1
  const query = `UPDATE posts SET eliminado = CASE WHEN eliminado = '1' THEN '0' ELSE '1' END WHERE id = "${postId}";`;
  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.error(error);
      return res.status(500).json({
        error: error,
        message: 'Error deleting post',
      });
    }
    res.status(200).json({
      message: 'Post deleted',
    });
  });
});

module.exports = router;