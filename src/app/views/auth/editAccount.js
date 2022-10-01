const { compare } = require("bcryptjs");

const User = require("../../models/auth");
const { generateToken } = require("../../../utils/services/auth");

module.exports = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email }).select("+password");
    if(!user) return res.status(404).json({ error: "User not found/exist." });
    const _password = await compare(password, user.password);
    if(!_password) return res.status(401).json({ error: "Invalid password." });
    user.password = password;
    user.name = (name.length > 0) ? name : user.name;
    await user.save();
    user = await User.findById(user._id);
    return res.json({
      token: generateToken({ id: user._id }),
      user,
      message: "Account successfully edited."
    });
  } catch (e) {
    return res.status(400).json({ error: "Failed to edit account.", code: e.message });
  }
}
