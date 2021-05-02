const mongoose = require('mongoose');

const url ="mongodb+srv://user1:user1@oberlo-storeino.lmaff.mongodb.net/OberloStoreino?retryWrites=true&w=majority";

const connectDB = async () => {
  await mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  console.log('db connected..!');
};

module.exports = connectDB;