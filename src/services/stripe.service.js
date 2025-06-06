const Stripe = require('stripe');
const config = require('../config');

class StripeService {
  constructor() {
    this.stripe = new Stripe(config.stripe.secretKey);
  }

  async createPaymentIntent(amount) {
    return await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd'
    });
  }
}

module.exports = new StripeService();