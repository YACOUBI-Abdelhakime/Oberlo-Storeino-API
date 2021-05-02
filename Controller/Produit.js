const express = require('express');
const mongoose = require('mongoose');
const User = require('../Model/Produit');
const route = express.Router();

// json ayji mgaaad at3tih dirikt l User(obj)
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