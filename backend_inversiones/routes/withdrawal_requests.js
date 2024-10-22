var express = require('express');
var router = express.Router();
var connection = require('../database');
const multer = require ('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'public/images/withdrawalRequests';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

//
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
  } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
      fileSize: 5 * 1024 * 1024 
  }
});


router.get('/', function (req, res, next) {
  const query = 'SELECT * FROM withdrawal_requests;';

  connection.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: error,
        message: 'Error in the query'
      });
    } else {
      console.log(results);
      res.status(200).json({
        data: results,
        message: 'List of withdrawal requests'
      });
    }
  });
});
router.get('/:id', function (req, res, next) {

  const { id } = req.params;
  const query = `SELECT * FROM withdrawal_requests WHERE withdrawal_requests_id = ${id};`;

  connection.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: error,
        message: 'Error in the query'
      });
    } else {
      console.log(results);
      res.status(200).json({
        data: results[0],
        message: 'Withdrawal request details'
      });
    }
  });
});

router.post('/', upload.fields([{ name: 'photo_document' }, { name: 'selfie_photo' }]), function (req, res, next) {
  const { investment_id, user_id, request_amount, commission_apply, receive_amount, status } = req.body;

  const photo_document = req.files['photo_document'] ? req.files['photo_document'][0].filename : null;
  const selfie_photo = req.files['selfie_photo'] ? req.files['selfie_photo'][0].filename : null;
  const projectStatus = status || 'pending';

  const query = `INSERT INTO withdrawal_requests (investment_id, user_id, request_amount, commission_apply, receive_amount, photo_document, selfie_photo, status)
                VALUES ('${investment_id}', '${user_id}', '${request_amount}', '${commission_apply}', '${receive_amount}', '${photo_document}', '${selfie_photo}', '${projectStatus}');`;

  connection.query(query, function (error, results) {
      if (error) {
          console.log(error);
          res.status(500).json({
              error: error,
              message: 'Error in the query'
          });
      } else {
          res.status(200).json({
              data: results,
              message: 'Withdrawal requested created succesfully'
          });
      }
  });
});


router.put('/:id', upload.fields([{ name: 'photo_document' }, { name: 'selfie_photo' }]), function (req, res, next) {
  const { id } = req.params;
  const { investment_id, user_id, request_amount, commission_apply, receive_amount, status } = req.body;


  const query = `SELECT photo_document, selfie_photo FROM withdrawal_requests WHERE withdrawal_requests_id = ${id};`;
  connection.query(query, function (error, result) {
      if (error) {
          console.log(error);
          return res.status(500).json({ error: error, message: 'Error in the query' });
      }

      const currentRequest = result[0];
      let photo_document = currentRequest.photo_document;
      let selfie_photo = currentRequest.selfie_photo;


      if (req.files) {
          if (req.files['photo_document']) {
              photo_document = req.files['photo_document'][0].filename;
              
              if (currentRequest.photo_document) {
                  fs.unlink(`${uploadDir}/${currentRequest.photo_document}`, err => {
                      if (err) console.log('Error in the query ', err);
                  });
              }
          }
          if (req.files['selfie_photo']) {
              selfie_photo = req.files['selfie_photo'][0].filename;
              
              if (currentRequest.selfie_photo) {
                  fs.unlink(`${uploadDir}/${currentRequest.selfie_photo}`, err => {
                      if (err) console.log('Error in the query ', err);
                  });
              }
          }
      }

      const updateQuery = `UPDATE withdrawal_requests SET investment_id = '${investment_id}', user_id = '${user_id}', 
                          request_amount = '${request_amount}', commission_apply = '${commission_apply}', 
                          receive_amount = '${receive_amount}', photo_document = '${photo_document}', 
                          selfie_photo = '${selfie_photo}', status = '${status}' 
                          WHERE withdrawal_requests_id = ${id};`;

      connection.query(updateQuery, function (error, results) {
          if (error) {
              console.log(error);
              return res.status(500).json({ error: error, message: 'Error in the query' });
          }
          res.status(200).json({
              data: results,
              message: 'Withdrawal request succesfully created'
          });
      });
  });
});


router.patch('/status/:id', function (req, res, next) {
  const { id } = req.params;

  const query = `
    UPDATE withdrawal_requests 
    SET status = CASE
                    WHEN status = 'pending' THEN 'approved'
                    WHEN status = 'approved' THEN 'rejected'
                    ELSE 'pending'
                END 
    WHERE withdrawal_requests_id = ${id};`;

  connection.query(query, function (error, results) {
    if (error) {
      console.log(error);
      res.status(500).json({
        error: error,
        message: 'Error in the query'
      });
    } else {
      res.status(200).json({
        data: results,
        message: 'Withdrawal status updated'
      });
    }
  });
});


router.delete('/:id', function(req, res, next) {
  const { id } = req.params;
  
  const query = `DELETE FROM withdrawal_requests WHERE withdrawal_requests_id = ${id};`;
  
  connection.query(query, function(error, results) {
      if (error){
          console.log(error);
          res.status(500).json({
              error: error,
              message: 'Error in the query'
          });
      }else{
          res.status(200).json({
              data: results,
              message: 'Withdrawal request deleted successfully'
          });
      }
  });
});


module.exports = router;