const ejs = require('ejs');

const User = require('../../models/auth');
const mailer = require('../../../utils/services/mail');

const { generateOTPToken, generateOTPCode } = require('../../../utils/services/auth');

module.exports = async (req, res) => {
  const { email: to } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found/exist.' });
    const token = generateOTPCode() || generateOTPToken();
    const now = new Date();
    now.setMinutes(now.getMinutes() + 3);
    await User.findByIdAndUpdate({ _id: user._id }, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    });
    // const html = require('../../../utils/templates/forgot_password')
    //   .replace('{{ username }}', user.name)
    //   .replace('{{ token }}', token);
    const html = await ejs
      .renderFile(`${__dirname}/../../../utils/templates/forgot_password.ejs`, {
        username: user.name, token
      }
      );
    mailer.sendMail({ to, subject: "Token de recuperação", html }, err => {
      if (err) return res.status(500).json({ error: 'Cannot send forgot password email.' });
    });
    return res.status(200).json({ message: 'Email successfully sent.' });
  } catch (e) {
    return res.status(400).json({ error: 'Error sending email, please try again.', code: e.message });
  }
}