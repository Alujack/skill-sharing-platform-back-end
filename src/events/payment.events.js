class PaymentEvents {
    static onSuccess(payment) {
      // Trigger enrollment creation
      // Send confirmation email
    }
  
    static onFailure(payment) {
      // Notify user
      // Log failure
    }
  }
  
  module.exports = PaymentEvents;