const Sample = require('../../models/sample');

module.exports = async(req, res) => {
  const samples = await Sample.find();
  return res.json(samples);
}
