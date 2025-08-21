const mongoose = require("mongoose");


const connectDB = async () => {


    await mongoose.connect("mongodb+srv://NamsteDev:8qKmtftyWNBKkdf2@namstenode.ptqybw.mongodb.net/devTinder");
};


module.exports=connectDB;


