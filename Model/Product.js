const Joi = require('joi');
const mongoose = require('mongoose');

const produit = new mongoose.Schema({
  _id: mongoose.ObjectId,
  title: {
    type:String,
    required:true
  },
  description: {
    type:String,
    required:true
  },
  price : {
    type:Number,
    required:true
  },
  images: [String],
  properties: [{
    title:String,
    list: [String],
  }],
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
});
var schema = mongoose.model('Product', produit);


function validateProduct(product) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description : Joi.string().required(),
    price: Joi.number().required(),
    images: Joi.array().items(Joi.string()),
    properties: Joi.array(),
    idUser:Joi.string(),

  });
  return schema.validate(product);
}
function validateUpdate(product) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description : Joi.string().required(),
    price: Joi.number().required(),
    images: Joi.array().items(Joi.string()),
    properties: Joi.array(),

  });
  return schema.validate(product);
}


module.exports.Product = schema;
module.exports.validateProduct = validateProduct;
module.exports.validateUpdate = validateUpdate;
