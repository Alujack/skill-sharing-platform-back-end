const nodemailer = require('nodemailer');
const config = require('../config');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport(config.email);
  }

  async send(to, subject, text) {
    await this.transporter.sendMail({ to, subject, text });
  }
}

module.exports = new EmailService();