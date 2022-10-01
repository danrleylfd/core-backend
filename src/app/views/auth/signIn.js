const { compare } = require("bcryptjs");

const User = require("../../models/auth");
const { generateToken } = require("../../../utils/services/auth");

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if(!user) return res.status(404).json({ error: "User not found/exist." });
    const _password = await compare(password, user.password);
    if(!_password) return res.status(401).json({ error: "Invalid password." });
    user.password = undefined;
    return res.json({
      token: generateToken({ id: user._id }),
      user,
      message: "Success to Sign In."
    });
  } catch (e) {
    return res.status(400).json({ error: "Sign In failed.", code: e.message });
  }
}
