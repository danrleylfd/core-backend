const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ejs = require('ejs');
const mailer = require('../../utils/services/mail');
const authConfig = require('../../utils/services/auth');

const User = require('../models/auth');

const generateToken = (data = {}) => {
  return jwt.sign(data, authConfig.secret, {
    expiresIn: 86400 // segundos = 1 dia
  });
}

const generateOTP = (counter, options) => {
  let characters = '';
  const { digits, lowerCaseAlphabets, upperCaseAlphabets } = options;
  if (digits) characters += '0123456789';
  if (lowerCaseAlphabets) characters += 'abcdefghijklmnopqrstuvwxyz';
  if (upperCaseAlphabets) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let otp = '';
  for (let i = 0; i < counter; i++) {
    otp += characters[Math.floor(Math.random() * characters.length)];
  }
  return otp;
}

module.exports.signUp = async (req, res) => {
  try {
    const { email } = req.body;
    if (await User.findOne({ email })) return res.status(401).json({ error: 'User already exists.' });
    const user = await User.create(req.body);
    user.password = undefined;
    return res.json({
      token: generateToken({ id: user._id }),
      user,
      message: 'Success to Sign Up.'
    });
  } catch (e) {
    return res.status(400).json({ error: 'Sign Up failed.', code: e.message });//500
  }
}

module.exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ error: 'User not found/exist.' });
    if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ error: 'Invalid password.' });
    user.password = undefined;
    return res.json({
      token: generateToken({ id: user._id }),
      user,
      message: 'Success to Sign In.'
    });
  } catch (e) {
    return res.status(400).json({ error: 'Sign In failed.', code: e.message });
  }
}

module.exports.forgotPasswordToken = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found/exist.' });
    const token = crypto.randomBytes(20).toString('hex');
    const now = new Date();
    now.setMinutes(now.getMinutes() + 3);
    await User.findByIdAndUpdate({ _id: user._id }, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    });
    // const html = require('../../resources/forgot_password')
    //   .replace('{{ username }}', user.name)
    //   .replace('{{ token }}', token);
    const html = await ejs.renderFile(__dirname + '/../../resources/forgot_password.ejs', {
      username: user.name,
      token
    });
    mailer.sendMail({
      from: "danrleydfl@gmail.com",
      to: email,
      subject: "Token de recuperação",
      html: html
    }, err => {
      if (err) return res.status(500).json({ error: 'Cannot send forgot password email.', token });
    });
    return res.status(200).json({ message: 'Email successfully sent.' });
  } catch (e) {
    return res.status(400).json({ error: 'Error sending email, please try again.', code: e.message });
  }
}

module.exports.forgotPasswordOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found/exist.' });
    const token = generateOTP(6, { ...authConfig.otp, specialChars: false });
    const now = new Date();
    now.setMinutes(now.getMinutes() + 3);
    await User.findByIdAndUpdate({ _id: user._id }, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    });
    // const html = require('../../resources/forgot_password')
    //   .replace('{{ username }}', user.name)
    //   .replace('{{ token }}', token);
    const html = await ejs.renderFile(__dirname + '/../../resources/forgot_password.ejs', {
      username: user.name,
      token
    });
    mailer.sendMail({
      from: "danrleydfl@gmail.com",
      to: email,
      subject: "Token de recuperação",
      html: html
    }, err => {
      if (err) return res.status(500).json({ error: 'Cannot send forgot password email.', token });
    });
    return res.status(200).json({ message: 'Email successfully sent.' });
  } catch (e) {
    return res.status(400).json({ error: 'Error sending email, please try again.', code: e.message });
  }
}

module.exports.resetPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires');
    if (!user) return res.status(404).json({ error: 'User not found/exist.' });
    if (token != user.passwordResetToken) return res.status(401).json({ error: 'Invalid token.' });
    const now = new Date();
    if (now > user.passwordResetExpires) return res.status(401).json({ error: 'Token expired, generate a new one.' });
    user.password = password;
    user.passwordResetExpires = now;
    await user.save();
    return res.status(200).json({ message: 'Password changed successfully.' });
  } catch (e) {
    return res.status(400).json({ error: 'Failed to change password, please try again.', code: e.message });
  }
}

module.exports.editAccount = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ error: 'User not found/exist.' });
    if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ error: 'Invalid password.' });
    user.password = password;
    user.name = (name.length > 0) ? name : user.name;
    await user.save();
    user = await User.findById(user._id);
    return res.json({
      token: generateToken({ id: user._id }),
      user,
      message: 'Account successfully edited.'
    });
  } catch (e) {
    return res.status(400).json({ error: 'Failed to edit account.', code: e.message });
  }
}

module.exports.deleteAccount = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ error: 'User not found/exist.' });
    if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ error: 'Invalid password.' });
    await User.deleteOne({ _id: user._id });
    return res.status(204);
  } catch (e) {
    return res.status(400).json({ error: 'failed to delete account.', code: e.message });
  }
}
