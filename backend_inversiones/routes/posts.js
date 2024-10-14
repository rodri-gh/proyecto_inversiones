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
      res.status(200).json({
        data: results,
        message: 'Listing posts',
      });

    }
  });
});

router.post('/', upload.single('imagen_portada'), function (req, res, next) {
  const { autor_id, categoria_id, titulo, resumen, contenido } = req.body;

  const fechaHoraFinal = new Date();

  // Formatear la fecha para MySQL
  const fechaFormateada = fechaHoraFinal.toISOString().slice(0, 19).replace('T', ' ');

  // Obtener la ruta del archivo cargado
  const imagen_portada = req.file ? `/${uploadDir}/${req.file.filename}` : null;

  const query = `
    INSERT INTO posts (autor_id, categoria_id, titulo, resumen, imagen_portada, fecha_hora, contenido) 
    VALUES ("${autor_id}", "${categoria_id}", "${titulo}", "${resumen}", "${imagen_portada}", "${fechaFormateada}", "${contenido}");
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
router.put('/:id', upload.single('imagen_portada'), function (req, res, next) {
  const postId = req.params.id;
  const { autor_id, categoria_id, titulo, resumen, contenido, fecha_hora } = req.body;

  
  const query = `SELECT imagen_portada FROM posts WHERE id = "${postId}";`;
  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.error(error);
      return res.status(500).json({
        error: error,
        message: 'Error retrieving post information',
      });
    }

    const currentPost = results[0];

    // Preparar los datos para la actualización
    const fechaHoraFinal = new Date();
    const fechaFormateada = fechaHoraFinal.toISOString().slice(0, 19).replace('T', ' ');

    let imagen_portada = currentPost.imagen_portada;
    if (req.file) {
      // Si se subió una nueva imagen, actualizar la ruta
      imagen_portada = `/${uploadDir}/${req.file.filename}`;

      // Eliminar la imagen antigua si existe
      if (currentPost.imagen_portada) {
        const oldImagePath = path.join(__dirname, '..', currentPost.imagen_portada);
        fs.unlink(oldImagePath, (err) => {
          console.error('Error deleting old image:', err);
        });
      }
    }

    const query = `
      UPDATE posts 
      SET autor_id = "${autor_id}" , categoria_id = "${categoria_id}", titulo = "${titulo}", resumen = "${resumen}", 
          imagen_portada = "${imagen_portada}" , fecha_hora = "${fechaFormateada}", contenido = "${contenido}"
      WHERE id = "${postId}";
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
router.delete('/:id', function (req, res, next) {
  const postId = req.params.id;

  const query = `SELECT imagen_portada FROM posts WHERE id = "${postId}";`;

  // Obtener la información del post para verificar si tiene una imagen asociada
  conexion.query(query, function (error, results, fields) {
    if (error) {
      console.error(error);
      return res.status(500).json({
        error: error,
        message: 'Error retrieving post information',
      });
    }

    // Verificar si se encontró el post
    if (results.length === 0) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    const currentPost = results[0];
    const imagen_portada = currentPost.imagen_portada;

    // Eliminar la imagen si existe
    if (imagen_portada) {
      const imagePath = path.join(__dirname, '..', imagen_portada);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
        }
      });
    }

    // Eliminar el post de la base de datos
    const query2 = `DELETE FROM posts WHERE id = "${postId}";`;
    conexion.query(query2, function (error, results, fields) {
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
});

router.put('/state/:id', function (req, res, next) {
  const { id } = req.params;

  const query = `UPDATE posts SET estado = !estado WHERE id=${id};`;

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
        message: 'Post updated',
      });
    }
  });
});


module.exports = router;