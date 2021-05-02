const mongoose = require('mongoose');

const user = new mongoose.Schema({
  _id: mongoose.ObjectId,
  fullName: String,
  email: String,
  password : String
});
var schema = mongoose.model('User', user);
module.exports = schema;


module.exports.getRanHex =function () {
  let result = [];
  let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

  for (let n = 0; n < 24; n++) {
    result.push(hexRef[Math.floor(Math.random() * 16)]);
  }
  return result.join('');
}
 