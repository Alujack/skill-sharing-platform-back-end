const ApiError = require('../utils/apiError');
const courseService = require('./course.service');

class PaymentService {
  constructor(paymentProvider, paymentRepository) {
    this.provider = paymentProvider;
    this.repository = paymentRepository;
  }

  async initiatePayment(userId, courseId) {
    const course = await courseService.getCourseById(courseId);
    
    const paymentIntent = await this.provider.createPaymentIntent(course.price);
    
    return this.repository.create({
      userId,
      courseId,
      amount: course.price,
      status: 'pending',
      transactionId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret
    });
  }
}

module.exports = PaymentService;