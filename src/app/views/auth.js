const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');
const authConfig = require('../../config/auth');

const User = require('../models/auth');

const generateToken = (data = {}) => {
  return jwt.sign(data, authConfig.secret, {
    expiresIn: 86400 // segundos = 1 dia
  });
}

module.exports.signUp = async (req, res) => {
  try {
    const { email } = req.body;
    if (await User.findOne({ email })) {
      return res.send({ error: 'User already exists.' });
    }
    const user = await User.create(req.body);
    user.password = undefined;
    console.log(user);
    return res.json({
      token: generateToken({ id: user._id }),
      user
    });
  } catch (err) {
    return res.status(400).send({ error: 'Registration failed.' });
  }
}

module.exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    if (!await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid password.' });
    }
    user.password = undefined;
    return res.json({
      token: generateToken({ id: user._id }),
      user
    });
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const token = crypto.randomBytes(20).toString('hex');
    const now = new Date();
    now.setHours(now.getHours() + 1);
    await User.findByIdAndUpdate({ _id: user._id }, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    });
    const html = require('../../resources/forgot_password')
      .replace('{{ username }}', user.name)
      .replace('{{ token }}', token);
    mailer.sendMail({
      from: "danrleydfl@gmail.com",
      to: email,
      subject: "Token de recuperação",
      html: html
    }, err => {
      console.log(err.code, err.message);
      if (err) return res.status(500).json({ error: 'Cannot send forgot password email.', token });
    });
    return res.send();
  } catch (err) {
    return res.status(400).json({ error: 'Error on forgot password, please try again.' });
  }
}

module.exports.resetPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;
    const user = await User.findOne({ email })
      .select('+passwordResetToken passwordResetExpires');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    if (token != user.passwordResetToken) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    const now = new Date();
    if (now > user.passwordResetExpires) {
      return res.status(401).json({ error: 'Token expired, generate a new one.' });
    }
    user.password = password;
    await user.save();
    res.send();
  } catch (err) {
    return res.status(400).json({ error: 'Cannot reset password, try again.' });
  }
}
