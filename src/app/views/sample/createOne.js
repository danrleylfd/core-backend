const Sample = require("../../models/sample");

module.exports = async(req, res) => {
  try {
    const { id: user } = req.query;
    const { name } = req.body;
    if(!name && name.length < 0) return res.status(422).json({ error: "name missing." });
    const sample = await Sample.create({ name, user });
    if(!sample) return res.status(404).json({ error: "Sample not found/exist." });
    return res.status(200).json(sample);
  } catch (e) {
    return res.status(400).json({ error: "Bad Request.", code: e.message });
  }
}
