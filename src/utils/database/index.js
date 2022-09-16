const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_HOST, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true
});

mongoose.Promise = global.Promise;

module.exports = mongoose;
