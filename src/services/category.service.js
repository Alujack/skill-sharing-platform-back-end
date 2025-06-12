const prisma = require('../prisma');
class CategoryService {
  // Get all categories
  async getAllCategories() {
    try {
      return await prisma.category.findMany({
      });
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  }

  // Get category by ID
  async getCategoryById(id) {
    try {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(id) },
        include: {
          courses: true
        }
      });
      
      if (!category) {
        throw new Error('Category not found');
      }
      
      return category;
    } catch (error) {
      throw new Error(`Failed to fetch category: ${error.message}`);
    }
  }

  // Create new category
  async createCategory(data) {
    try {
      const { name } = data;
      
      if (!name || name.trim() === '') {
        throw new Error('Category name is required');
      }

      return await prisma.category.create({
        data: { name: name.trim() }
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Category name already exists');
      }
      throw new Error(`Failed to create category: ${error.message}`);
    }
  }

  // Update category
  async updateCategory(id, data) {
    try {
      const { name } = data;
      
      if (!name || name.trim() === '') {
        throw new Error('Category name is required');
      }

      const category = await prisma.category.update({
        where: { id: parseInt(id) },
        data: { name: name.trim() }
      });
      
      return category;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Category name already exists');
      }
      if (error.code === 'P2025') {
        throw new Error('Category not found');
      }
      throw new Error(`Failed to update category: ${error.message}`);
    }
  }

  // Delete category
  async deleteCategory(id) {
    try {
      await prisma.category.delete({
        where: { id: parseInt(id) }
      });
      
      return { message: 'Category deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Category not found');
      }
      if (error.code === 'P2003') {
        throw new Error('Cannot delete category with associated courses');
      }
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }
}

module.exports = new CategoryService();