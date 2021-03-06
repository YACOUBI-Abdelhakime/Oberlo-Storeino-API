const express = require('express');
const mongoose = require('mongoose');
const auth = require('../midleware/auth');
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

route.post('/',auth, async (req, res) => {
    const products = await Product.find({"idUser":req.userId});
    res.json({"res":"ok","products":products});
}); 
route.post('/getOne',auth, async (req, res) => {
    const {id} = req.body; 
    const product = await Product.findOne({"_id":id,"idUser":req.userId});
    res.json({"res":"ok","product":product}); 
});
route.post('/add',auth, async (req, res) => {
    const {product}  = req.body;
    const {error} = validateProduct(product);
    if(error) return res.json( {"res":"error","message":error.details[0].message+"888"} );

    const exist = await Product.findOne({"title":product.title,"idUser":req.userId});
    if(exist) return res.json({"res":"error","message":"Product already exist" });

    product._id = new mongoose.Types.ObjectId();
    const model = new Product(product);
    const obj = await model.save();
    res.json({"res":"ok","product":obj});
});
route.post('/update',auth, async (req, res) => { 
    const {id,product}  = req.body;
    const {error} = validateUpdate(product);
    if(error) return res.json({"res":"error","message":error.details[0].message });

    const exist = await Product.findOne({"_id":id,"idUser":req.userId});
    if(!exist) return res.json({"res":"error","message": "product id or token invalid." });

    const obj = await Product.findByIdAndUpdate(id,product,{"new":true});
    res.json({"res":"ok","product":obj});
});
route.post('/delete',auth, async (req, res) => {
    const {id}  = req.body;

    const exist = await Product.findOne({"_id":id,"idUser":req.userId});
    if(!exist) return res.json({"res":"error","message": "product id or token invalid." });

    const obj = await Product.findByIdAndDelete(id);
    res.json({"res":"ok"});
});
route.post('/deleteAll',auth, async (req, res) => {
    const obj = await Product.deleteMany({"idUser":req.userId});
    res.json({"deletedCount":obj.deletedCount});
});
module.exports = route;
