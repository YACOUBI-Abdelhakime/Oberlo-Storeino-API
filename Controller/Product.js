const express = require('express');
const mongoose = require('mongoose');
const Product = require('../Model/Product');
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
    produit._id = Product.getRanHex();
    try{
        const model = new Product(produit);
        const obj = await model.save();
        res.json(obj);
    }catch(e){
        res.json({"ErrTitle":e.name,"Message":e.message,"route":"<post:product/add/>"});
    }
});
route.post('/update', async (req, res) => {
    const {id,produit}  = req.body;
    try{
        const obj = await Product.findByIdAndUpdate(id,produit,{"new":true});
        res.json(obj);
    }catch(e){
        res.json({"ErrTitle":e.name,"Message":e.message,"route":"<post:product/updete/>"});
    }
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