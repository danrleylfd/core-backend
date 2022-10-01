const User = require("../../models/auth");
const { generateToken } = require("../../../utils/services/auth");

module.exports = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if(!name && name.length < 0) return res.status(422).json({ error: "name missing." });
    if(!email && email.length < 0) return res.status(422).json({ error: "email missing." });
    if(!password && password.length < 8) return res.status(422).json({ error: "password missing or too short." });
    const _user = await User.findOne({ email });
    if(_user) return res.status(401).json({ error: "User already exists." });
    const user = await User.create({ name, email, password });
    user.password = undefined;
    return res.status(201).json({
      token: generateToken({ id: user._id }),
      user,
      message: "Success to Sign Up."
    });
  } catch (e) {
    return res.status(400).json({ error: "Sign Up failed.", code: e.message });//500
  }
}
