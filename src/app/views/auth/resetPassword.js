const User = require("../../models/auth");

module.exports = async (req, res) => {
  try {
    const { email, token, password } = req.body;
    const user = await User.findOne({ email }).select("+passwordResetToken passwordResetExpires");
    if(!user) return res.status(404).json({ error: "User not found/exist." });
    if(token != user.passwordResetToken) return res.status(401).json({ error: "Invalid token." });
    const now = new Date();
    if(now > user.passwordResetExpires) return res.status(401).json({ error: "Token expired, generate a new one." });
    user.password = password;
    user.passwordResetExpires = now;
    await user.save();
    return res.status(200).json({ message: "Password changed successfully." });
  } catch (e) {
    return res.status(400).json({ error: "Failed to change password, please try again.", code: e.message });
  }
}
