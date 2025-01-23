const mongoose = require("mongoose");

const ConnectDB = async() =>{
    await mongoose.connect("mongodb+srv://abhishekkaul32:qDfvWIIuu8jUcNAm@cluster0.zzvpg.mongodb.net/DevTinder")
} 

module.exports = ConnectDB;