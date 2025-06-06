const Joi = require('joi');

const createEnrollmentSchema = Joi.object({
  courseId: Joi.number().integer().required()
});

module.exports = {
  createEnrollmentSchema
};