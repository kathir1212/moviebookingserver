const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/forgetpassword');
const sendEmail = require('../utils/email');

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetLink = `http://localhost:5173/reset-password/${token}`;
  await sendEmail(email, 'Password Reset', `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`);
  
  res.json({ message: 'Password reset link sent to email.' });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = await bcrypt.hash(newPassword, 12);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: 'Password updated successfully' });
};
