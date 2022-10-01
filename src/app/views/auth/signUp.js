const User = require("../../models/auth");
const { generateToken } = require("../../../utils/services/auth");

module.exports = async (req, res) => {
  try {
    const { email } = req.body;
    const _user = await User.findOne({ email });
    if(_user) return res.status(401).json({ error: "User already exists." });
    const user = await User.create(req.body);
    user.password = undefined;
    return res.json({
      token: generateToken({ id: user._id }),
      user,
      message: "Success to Sign Up."
    });
  } catch (e) {
    return res.status(400).json({ error: "Sign Up failed.", code: e.message });//500
  }
}
