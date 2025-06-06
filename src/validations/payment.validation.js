const Joi = require('joi');

const createPaymentSchema = Joi.object({
  courseId: Joi.number().integer().required(),
  paymentMethodId: Joi.string().required()
});

module.exports = { createPaymentSchema };