const mongoose = require("mongoose");

const ConnectDB = async() =>{
    await mongoose.connect("mongodb+srv://abhishekkaul32:GsEXCVUTWqfCctqs@devtinder.zzvpg.mongodb.net/DevDB")
} 

module.exports = ConnectDB;