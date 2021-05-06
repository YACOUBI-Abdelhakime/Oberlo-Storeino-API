const express = require('express');
const mongoose = require('mongoose');
const {Product,validateProduct,validateUpdate} = require('../Model/Product');
const route = express.Router();

/**
 * ****Routes****
 * <post:/product/>
 * <post:/product/getOne>
 * <post:/product/add>
 * <post:/product/update>
 * <post:/product/delete>
 * <post:/product/deleteAll>
 */
route.post('/', async (req, res) => {
    const {idUser} = req.body;
    try{
        const products = await Product.find({"idUser":idUser});
        res.json(products);
    }catch(e){
        res.json({"ErrTitle":e.name,"Message":e.message,"route":"<post:product/>"});
    }
});
route.post('/getOne', async (req, res) => {
    const {id} = req.body;
    try{
        const product = await Product.findById(id);
        res.json(product);
    }catch(e){
        res.json({"ErrTitle":e.name,"Message":e.message,"route":"<post:product/getOne/>"});
    }
});
route.post('/add', async (req, res) => {
    const produit  = req.body;
    const {error} = validateProduct(produit);
    if(error) return res.status(400).json({"err":error.details[0].message});

    const exist = await Product.findOne({"title":produit.title});
    if(exist) return res.status(400).json({"err":"Product already exist"});

    produit._id = new mongoose.Types.ObjectId();
    const model = new Product(produit);
    const obj = await model.save();
    res.json(obj);
});
route.post('/update', async (req, res) => {
    const {id,produit}  = req.body;
    const {error} = validateUpdate(produit);
    if(error) return res.status(400).json({"err":error.details[0].message});

    const obj = await Product.findByIdAndUpdate(id,produit,{"new":true});
    res.json(obj);
});
route.post('/delete', async (req, res) => {
    const {id}  = req.body;
    try{
        const obj = await Product.findByIdAndDelete(id);
        res.json(obj);
    }catch(e){
        res.json({"ErrTitle":e.name,"Message":e.message,"route":"<post:product/delete/>"});
    }
});
route.post('/deleteAll', async (req, res) => {
    const {idUser}  = req.body;
    try{
        const obj = await Product.deleteMany({"idUser":idUser});
        res.json(obj);
    }catch(e){
        res.json({"ErrTitle":e.name,"Message":e.message,"route":"<post:product/deleteAll/>"});
    }
});
module.exports = route;

/*
//EXEMPLE JSON PRODUCT
{
    "_id":"..",
    "title":"prodtitle",
    "description":"des aaaa 7777 eeeeeee ",
    "price":777,
    "idUser":"6fb81011dfb09ded58b99aef",
    "images":["https://1-jhkjhkjjkj","https://2-jhkjhkjjkj","https://3-jhkjhkjjkj"],
    "properties":[
        {
            "title":"Colors",
            "list":["red","green","blue"]
        },
        {
            "title":"hight",
            "list":["8","8.5","9","10"]
        }
    ]
}
 */