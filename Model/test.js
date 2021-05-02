const mongoose = require('mongoose');

const tst = new mongoose.Schema({
  name: {
    type: String
  },
  age: {
    type: Number
  }
});
var schema = mongoose.model('test', tst);
module.exports = schema;