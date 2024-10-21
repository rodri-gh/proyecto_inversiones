var express = require('express');
var router = express.Router();
var connection = require('../database');


router.get('/', function (req, res, next) {
  const query = 'SELECT * FROM category_posts;';

  connection.query(query, function (error, results, fields) {
    if (error) {
      return res.status(500).json({
        error: error,
        message: 'Error in the query',
      });
    }

    res.status(200).json({
      data: results,
      message: ' List of category posts',
    });
  });
});


router.post('/', function (req, res, next) {
  const { name } = req.body;

  const query = 'INSERT INTO category_posts (name) VALUES (?);';

  connection.query(query, [name], function (error, results, fields) {
    if (error) {
      return res.status(500).json({
        error: error,
        message: 'Error in the query',
      });
    }

    res.status(201).json({
      message: 'Category post created successfully',
    });
  });
});


router.put('/:id', function (req, res, next) {

  const postId = req.params.id;
  const { name } = req.body;

  const query = 'UPDATE category_posts SET name = ? WHERE category_post_id = ?;';

  connection.query(query, [name, postId], function (error, results, fields) {

    if (error) {
      return res.status(500).json({
        error: error,
        message: 'Error in the query',
      });
    }

    res.status(200).json({
      message: 'Category post updated successfully',
    });
  });

});

module.exports = router;






