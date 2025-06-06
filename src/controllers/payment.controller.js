const httpStatus = require('http-status');
const { sendResponse } = require('../utils/apiResponse');
const { createPaymentSchema } = require('../validations/payment.validation');

class PaymentController {
  constructor(paymentService) {
    this.service = paymentService;
  }

  async createPayment(req, res, next) {
    try {
      const validatedData = await createPaymentSchema.validateAsync(req.body);
      const payment = await this.service.initiatePayment(
        req.user.id,
        validatedData.courseId
      );
      sendResponse(res, httpStatus.CREATED, payment);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;