const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const {User,validateUser,validateEmail,validateUpdate} = require('../Model/User');
const route = express.Router();

/**
 * <post:/user/>
 * <post:/user/add>
 * <post:/user/update>
 */

route.post('/',async(req,res)=>{
    const {password,email} = req.body;
    const {error} = validateEmail({email});
    if(error) return res.status(400).json({"err":error.details[0].message});

    let obj = await User.findOne({"email":email});
    const isEqual = bcrypt.compareSync(password, obj.password);
    if(!isEqual)return res.status(400).json({"err":"email or password not correct"});

    obj = new User(_.pick(obj,["_id","fullName","email"]));
    const token = obj.generateToken();
    res.header("x-token",token).json(obj);
});
route.post('/emailConfirm', async (req, res) => {
    const {email} = req.body; 
    const {error} = validateEmail({email});
    if(error) return res.status(400).json({"err":error.details[0].message});

    const exist = await User.findOne({"email":email});
    if(exist) return res.status(400).json({"err":"User already exist"});
    //send email with code 
    const code = Math.floor((Math.random() * 999999) + 100000);
    sendEmail(email,code);

    res.json({"code":code});
});
route.post('/add', async (req, res) => {
    const user = req.body; 
    const {error} = validateUser(user);
    if(error) return res.status(400).json({"err":error.details[0].message});

    /*const exist = await User.findOne({"email":user.email});
    if(exist) return res.status(400).json({"err":"User already exist"});*/

    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
    user._id = new mongoose.Types.ObjectId();

    const model = new User(user);
    let obj = await model.save();
    obj = new User(_.pick(obj,["_id","fullName","email"]));
    res.json(obj);
});
route.post('/update', async (req, res) => {
    const {id,user}  = req.body;
    const {error} = validateUpdate(user);
    if(error) return res.status(400).json({"err":error.details[0].message});

    let obj = await User.findByIdAndUpdate(id,user,{"new":true});
    obj = new User(_.pick(obj,["_id","fullName","email"]));
    res.json(obj);
});

function sendEmail(email,code){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'hakim.199911@gmail.com',
          pass: '0628942060Y@cb'
        }
    });
      
    const mailOptions = {
        from: 'hakim.199911@gmail.com',
        to: email,
        subject: 'Storeino email Confirmation',
        text: 'code is : '+code
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = route;
