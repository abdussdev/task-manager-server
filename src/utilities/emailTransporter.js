const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'abdusjscript@gmail.com',
    pass: 'mhwg plsr wvyq gmbn'
  }
});

module.exports=transporter;