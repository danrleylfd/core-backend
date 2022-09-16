const User = require('../../models/auth');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found/exist.' });
    return res.json({ user, message: 'Success to get user.' });
  } catch (e) {
    return res.status(400).json({ error: 'Sign In failed.', code: e.message });
  }
}
