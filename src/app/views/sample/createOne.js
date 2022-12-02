const Sample = require("../../models/sample");

module.exports = async (req, res) => {
  try {
    const { id: user } = req.query;
    const { name } = req.body;
    if (!name || name.trim().length === 0) return res.status(422).json({ error: "name missing." });
    const _sample = await Sample.findOne({ name });
    if (_sample) return res.status(401).json({ error: "Sample already exists." });
    const sample = await Sample.create({
      user: user,
      name: name.trim()
    });
    return res.status(201).json(sample);
  } catch (e) {
    return res.status(400).json({ error: "Bad Request.", code: e.message });
  }
}
