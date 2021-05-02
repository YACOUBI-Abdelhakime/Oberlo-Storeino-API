const express = require('express');
const mongoose = require('mongoose');
const User = require('../Model/User');
const route = express.Router();


route.get('/', async (req, res) => {
    try{
        let obj = await User.find();
        res.json({obj});
    }catch(e){
        console.log("!!ERR <post:user/> "+e.name +"| Desc :"+e.message )
        res.json({"ErrTitle":e.name,"Message":e.message,"route":"<get:user/>"});
    }
    
    
});
route.post('/',async(req,res)=>{
    const { email, password } = req.body;
    let user = {};
    user.email = email;
    user.password = password;
    try{
        let obj = await User.find(user);
        res.json({obj});
    }catch(e){
        console.log("!!ERR <post:user/> "+e.name +"| Desc :"+e.message )
        res.json({"ErrTitle":e.name,"Message":e.message,"route":"<post:user/>"});
    }
});
route.post('/add', async (req, res) => {
    const { fullName, email, password } = req.body;
    let user = {};
    user._id = User.getRanHex(24);
    user.fullName = fullName;
    user.email = email;
    user.password = password;
    try{
        let model = new User(user);
        await model.save();
        let obj = await User.find(user);
        res.json({obj});
    }catch(e){
        console.log("!!ERR <post:user/> "+e.name +"| Desc :"+e.message )
        res.json({"ErrTitle":e.name,"Message":e.message,"route":"<post:user/add/>"});
    }
  });


module.exports = route;