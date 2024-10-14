const express = require('express');
const router = express.Router();
const postCategoryControl = require('../controllers/postCategoryControl');


//POSTS CATEGORY 
router.post('/category', postController.createCategoryPost);

router.get('/category', postController.getCategoryPosts);

router.put('/category/:id', postController.updateCategoryPost);

router.delete('/category/:id', postController.deleteCategoryPost);


module.exports = router;