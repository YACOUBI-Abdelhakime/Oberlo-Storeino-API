const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const user = new mongoose.Schema({
  _id: mongoose.ObjectId,
  fullName: {
    type:String,
    required:true
  },
  email: {
    type:String,
    unique:true,
    required:true
  },
  password : {
    type:String,
    required:true
  },
});
user.methods.generateToken = function(){
  return jwt.sign({"id":this._id}, "jwtPrivateKey");
}
var schema = mongoose.model('User', user);

function validateUser(user) {
  const schema = Joi.object({
    fullName: Joi.string().min(3).required(),
    email: Joi.string().required().email(),
    password : Joi.string().min(3).required(),
  });
  return schema.validate(user);
}
function validateEmail(login) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
  });
  return schema.validate(login);
}
function validateUpdate(up) {
  const schema = Joi.object({
    fullName: Joi.string().min(3).required(),
    password : Joi.string().min(3).required(),
  });
  return schema.validate(up);
} 
 

module.exports.User = schema;
module.exports.validateUser = validateUser;
module.exports.validateEmail = validateEmail;
module.exports.validateUpdate = validateUpdate;