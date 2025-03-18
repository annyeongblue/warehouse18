const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or any email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => {
  const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
  return otp;
};

const sendOTP = async (email) => {
  const otp = generateOTP();

  // Send OTP via email
  await transporter.sendMail({
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  });

  // Store OTP in a temporary session or database
  // You can store it in the user's model or in a temporary table
  // Store OTP with an expiration time, e.g., 5 minutes
  // Example: await strapi.query('otp').create({ otp, email, expiresAt: Date.now() + 5 * 60 * 1000 });

  return otp; // return OTP (in real use case, store it securely and link with the user)
};

module.exports = {
  sendOTP,
};
