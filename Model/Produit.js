import mongoose from "mongoose";

const produit = new mongoose.Schema({
  _id: mongoose.ObjectId,
  title: String,
  description: String,
  prix : Number,
  images: [String],
  propertys: [{
    title:String,
    list: [String],
  }],
  idUser:String,
});
var schema = mongoose.model('Produit', produit);
module.exports = schema;

module.exports.getRanHex =function () {
  let result = [];
  let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

  for (let n = 0; n < 24; n++) {
    result.push(hexRef[Math.floor(Math.random() * 16)]);
  }
  return result.join('');
}