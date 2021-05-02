const express = require('express');
const mongoose = require('mongoose');
const User = require('../Model/User');
const route = express.Router();

/**
 * <post:/user/>
 * <post:/user/add>
 * <post:/user/update>
 */

route.post('/',async(req,res)=>{
    const login = req.body;
    try{
        const obj = await User.findOne(login);
        res.json(obj);
    }catch(e){
        res.json({"ErrTitle":e.name,"Message":e.message,"route":"<post:user/>"});
    }
});
route.post('/add', async (req, res) => {
    const user = req.body;
    user._id = User.getRanHex();
    try{
        const model = new User(user);
        const obj = await model.save();
        res.json(obj);
    }catch(e){
        res.json({"ErrTitle":e.name,"Message":e.message,"route":"<post:user/add/>"});
    }
});
route.post('/update', async (req, res) => {
    const {id,user}  = req.body;
    try{
        const obj = await User.findByIdAndUpdate(id,user,{"new":true});
        res.json(obj);
    }catch(e){
        res.json({"ErrTitle":e.name,"Message":e.message,"route":"<post:user/updete/>"});
    }
});


module.exports = route;