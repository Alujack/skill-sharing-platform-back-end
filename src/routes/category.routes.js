const express = require('express');
const categoryController = require('../controllers/category.controller');
const router = express.Router();


router.get('/', categoryController.getAllCategories);
router.get('/:id/course', categoryController.getCategoryById);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
module.exports = router;