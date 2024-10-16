const nodemailer = require('nodemailer');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nandeeswararajam.ug.21.cb@francisxavier.ac.in', // Replace with your email
    pass: 'adfdfadff$'   // Replace with your email password
  }
});

// Function to send OTP email
const sendOTPEmail = (email, otp) => {
  const mailOptions = {
    from: 'nandeeswararajam.ug.21.cb@francisxavier.ac.in',
    to: email,
    subject: 'Your OTP for Password Reset',
    text: `Your OTP for password reset is: ${otp}`
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
