const mongoose = require('mongoose');

//const url ="mongodb+srv://user1:user1@oberlo-storeino.lmaff.mongodb.net/OberloStoreino?retryWrites=true&w=majority";
const url ="mongodb://127.0.0.1:27017/";
 
const connectDB = async () => {
  await mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
  });
  console.log('db connected..!');
};

module.exports = connectDB;