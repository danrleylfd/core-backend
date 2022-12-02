const Sample = require("../../models/sample");

module.exports = async (req, res) => {
  try {
    const { id: sampleID } = req.params;
    if (!sampleID || sampleID.trim().length === 0) return res.status(422).json({ error: "sampleId missing." });
    const sample = await Sample.findOne({ _id: sampleID }).populate("user").exec();
    if (!sample) return res.status(404).json({ error: "Sample not found/exist." });
    return res.status(200).json(sample);
  } catch (e) {
    return res.status(400).json({ error: "Bad Request.", code: e.message });
  }
}
