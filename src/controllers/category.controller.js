const categoryService = require('../services/category.service');

class CategoryController {
  // GET /categories
  async getAllCategories(req, res) {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(200).json({
        success: true,
        data: categories,
        message: 'Categories fetched successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /categories/:id
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(id);
      
      res.status(200).json({
        success: true,
        data: category,
        message: 'Category fetched successfully'
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /categories
  async createCategory(req, res) {
    try {
      const category = await categoryService.createCategory(req.body);
      
      res.status(201).json({
        success: true,
        data: category,
        message: 'Category created successfully'
      });
    } catch (error) {
      const statusCode = error.message.includes('required') || 
                        error.message.includes('already exists') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /categories/:id
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const category = await categoryService.updateCategory(id, req.body);
      
      res.status(200).json({
        success: true,
        data: category,
        message: 'Category updated successfully'
      });
    } catch (error) {
      let statusCode = 500;
      if (error.message.includes('not found')) statusCode = 404;
      if (error.message.includes('required') || 
          error.message.includes('already exists')) statusCode = 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /categories/:id
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const result = await categoryService.deleteCategory(id);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      let statusCode = 500;
      if (error.message.includes('not found')) statusCode = 404;
      if (error.message.includes('associated courses')) statusCode = 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new CategoryController();