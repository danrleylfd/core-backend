const Sample = require("../../models/sample");

module.exports = async (req, res) => {
  try {
    const { id: user } = req.query;
    const { oldName } = req.params;
    const { newName } = req.body;
    if (!oldName || oldName.trim().length === 0) return res.status(422).json({ error: "oldName missing." });
    if (!newName || newName.trim().length === 0) return res.status(422).json({ error: "newName missing." });
    let sample = await Sample.findOne({ name: oldName });
    if (!sample) return res.status(404).json({ error: "Sample not found/exist." });
    if (sample.user.toString() !== user) return res.status(401).json({ error: "You are not the owner of this sample." });
    sample.name = newName;
    await sample.save();
    sample = await Sample.findOne({ user });
    return res.status(201).json(sample);
  } catch (e) {
    return res.status(400).json({ error: "Bad Request.", code: e.message });
  }
}
