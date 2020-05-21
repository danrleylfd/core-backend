const Example = require('../models/example');

module.exports.read = async(req, res) => {
  const examples = await Example.find();
  return res.json(examples);
}