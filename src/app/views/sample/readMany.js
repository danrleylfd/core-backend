const Sample = require("../../models/sample");

module.exports = async(req, res) => {
  try {
    const { id: user } = req.query;
    const samples = await Sample.find({ user });
    if(!samples) return res.status(404).json({ error: "Samples not found/exist." });
    return res.status(200).json(samples);
  } catch (e) {
    return res.status(400).json({ error: "Bad Request.", code: e.message });
  }
}
