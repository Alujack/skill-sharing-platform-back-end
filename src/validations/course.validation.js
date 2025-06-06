const Joi = require('joi');

const createCourseSchema = Joi.object({
  title: Joi.string().required().min(5).max(100),
  description: Joi.string().required().min(20),
  price: Joi.number().min(0).precision(2),
  categoryId: Joi.number().integer().required(),
  isPublished: Joi.boolean().default(false)
});

const updateCourseSchema = Joi.object({
  title: Joi.string().min(5).max(100),
  description: Joi.string().min(20),
  price: Joi.number().min(0).precision(2),
  categoryId: Joi.number().integer(),
  isPublished: Joi.boolean()
});

module.exports = {
  createCourseSchema,
  updateCourseSchema
};