const bcrypt = require('bcryptjs');

const User = require('../../models/auth');

module.exports = async (req, res) => {
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
