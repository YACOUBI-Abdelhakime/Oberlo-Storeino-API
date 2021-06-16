const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const auth = require('../midleware/auth');
const fs = require('fs');
const {User,validateUser,validateEmail,validateUpdate} = require('../Model/User');
const { isEqual } = require('lodash');
const route = express.Router();

/**
 * <post:/user/>
 * <post:/user/add>
 * <post:/user/update>
 */
route.get('/tokenStoreino',async(req,res)=>{
    res.json({"storeinoToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYwYWQwY2I4YTg3ZTJjMTZiNDg4MmZiMSIsImZpcnN0bmFtZSI6ImFiZGVsaGFraW1lIiwibGFzdG5hbWUiOiJ5YWNvdWJpIiwicG9zaXRpb24iOiJDTElFTlQiLCJlbWFpbCI6Imhha2ltLjE5OTkxMUBnbWFpbC5jb20iLCJhZGRyZXNzIjpudWxsfSwiY29tcGFueSI6eyJfaWQiOiI2MGFkMGNiOGE4N2UyYzE2YjQ4ODJmYWYiLCJuYW1lIjoib2JlcmxvIiwic3RhdHVzIjoiVU5DT01QTEVURUQifSwic3RvcmUiOnsiX2lkIjoiNjBhZDBjY2FhODdlMmMxNmI0ODgyZmI4IiwibmFtZSI6Ik9iZXJsbyIsInN1YmRvbWFpbiI6Im9iZXJsby5zdG9yZWluby5jb20ifSwiaWF0IjoxNjIzNzEwNjI2LCJleHAiOjE2NTUyNDY2MjZ9.hn9-Qn6GGlZChDnqws-g1nitmfkENTK2240dco8Mhpo"});
});

route.post('/',async(req,res)=>{
    const {password,email} = req.body;

    const {error} = validateEmail({email});
    if(error) return res.json({"res":"error","message":error.details[0].message});

    let obj = await User.findOne({"email":email});
    let isEqual = false;
    if(obj){
        isEqual = bcrypt.compareSync(password, obj.password);
    }
    
    if(!isEqual)return res.json({"res":"error","message":"email or password not correct"});

    obj = new User(obj);
    const token = obj.generateToken();
    res.header("x-token",token).json({"res":"ok","user": _.pick(obj,["_id","fullName","email"])});
});
route.post('/emailConfirm', async (req, res) => {
    const {email} = req.body; 
    const {error} = validateEmail({email});
    if(error) return res.json({"res":"error","message":error.details[0].message});

    const exist = await User.findOne({"email":email});
    if(exist) return res.json({"res":"error","message":"User already exist"});
    //send email with code 
    const code = Math.floor((Math.random() * 999999) + 100000);
    sendEmail(email,code);

    res.json({"res":"ok","code":code});
});
route.post('/add', async (req, res) => {
    const {userData} = req.body; 
    const {error} = validateUser(userData);
    if(error) return res.json({"res":"error","message":error.details[0].message});

    const exist = await User.findOne({"email":userData.email});
    if(exist) return res.json({"res":"error","message":"User already exist"});

    const salt = bcrypt.genSaltSync(10);
    userData.password = bcrypt.hashSync(userData.password, salt);
    userData._id = new mongoose.Types.ObjectId();

    const model = new User(userData);
    let obj = await model.save();
    const token = obj.generateToken();
    res.header("x-token",token).json({"res":"ok","user": _.pick(obj,["_id","fullName","email"])});
});
route.post('/update',auth, async (req, res) => {
    const {changePass,oldPass,user}  = req.body;
    const {error} = validateUpdate(user);
    if(error) return res.json({"res":"error","message":error.details[0].message});
    
    if(changePass){
        let obj = await User.findOne({'_id':req.userId});
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
        let isEqual
            
        isEqual = bcrypt.compareSync(oldPass, obj.password);
        console.log("Pass ok "+isEqual)

        if(isEqual){
            await User.updateOne({_id:req.userId},user)
            obj = await User.findOne({'_id':req.userId});
            
        }else{
            return res.json({"res":"error","message":"Old password is not correct."});
        }

        obj = new User(_.pick(obj,["_id","fullName","email"]));
        res.json({"res":"ok","user":obj});
    }else{
        await User.updateOne({_id:req.userId},user)
        let obj = await User.findOne({'_id':req.userId});

        obj = new User(_.pick(obj,["_id","fullName","email"]));
        console.log("OBJ--id : "+obj._id+" name : "+obj.fullName+" email : "+obj.email )
        res.json({"res":"ok","user":obj});
    }
});

async function sendEmail(email,code){
    let password,myEmail="hakim.199911@gmail.com";
    password = fs.readFileSync('./pass.txt',{encoding:'utf8', flag:'r'}); 

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: myEmail,
          pass: password,
        }
    });
      
    const mailOptions = {
        from: myEmail,
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
