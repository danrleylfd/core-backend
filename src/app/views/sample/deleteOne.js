const Sample = require("../../models/sample");

module.exports = async (req, res) => {
  try {
    const { id: user } = req.query;
    const { name } = req.body;
    if (!name || name.trim().length === 0) return res.status(422).json({ error: "name missing." });
    const sample = await Sample.findOne({ name });
    if (!sample) return res.status(404).json({ error: "Sample not found/exist." });
    if(sample.user.toString() === user) return res.status(401).json({ error: "You are not the owner of this sample." });
    await Sample.deleteOne({ name });
    return res.status(204).json({ message: "Successfully deleted." });
  } catch (e) {
    return res.status(400).json({ error: "Bad Request.", code: e.message });
  }
}
