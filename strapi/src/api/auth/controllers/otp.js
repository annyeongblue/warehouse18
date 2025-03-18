const otpService = require('../services/otp');

module.exports = {
  async requestOTP(ctx) {
    const { email } = ctx.request.body;
    const otp = await otpService.sendOTP(email);
    ctx.send({ message: 'OTP sent successfully', otp });
  },

  async verifyOTP(ctx) {
    const { email, otp } = ctx.request.body;

    // Verify OTP (check from the database or session)
    // Example: const storedOtp = await strapi.query('otp').findOne({ email });
    // If OTP is valid and not expired:
    // If the OTP matches, proceed with authentication.

    // For simplicity, we assume OTP is correct in this example
    if (otp === 'expected_otp') {
      ctx.send({ message: 'OTP verified successfully' });
    } else {
      ctx.send({ message: 'Invalid OTP' }, 400);
    }
  },
};
