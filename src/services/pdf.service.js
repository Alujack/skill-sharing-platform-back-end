const PDFDocument = require('pdfkit');

class PDFService {
  generateCertificate(studentName, courseName, date) {
    const doc = new PDFDocument();
    doc.text(`Certificate of Completion`, { align: 'center' });
    doc.text(`This certifies that ${studentName}`, { align: 'center' });
    doc.text(`has successfully completed ${courseName}`, { align: 'center' });
    doc.text(`on ${date.toDateString()}`, { align: 'center' });
    return doc;
  }
}

module.exports = new PDFService();