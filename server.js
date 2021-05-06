const express = require('express');
const connectDB = require('./Connection/BD');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');




 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
const PORT = 8085;


connectDB();
app.use(express.json({ extended: false }));
app.use('/user', require('./Controller/User'));
app.use('/product', require('./Controller/Product'));

app.get('/',(req,res)=>{
    res.send("route <get:/>");
});


app.listen(PORT, () => console.log('Server started  in '+PORT));
