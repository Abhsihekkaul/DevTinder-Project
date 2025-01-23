const mongoose = require("mongoose")

const userSchema =  new mongoose.Schema({
    firstName : {
        type: String
    },
    lastName : {
        type: String
    },
    Email : {
        type: String
    },
    password : {
        type: String
    },
    Age:{
        type : Number
    }

});

module.exports = mongoose.model("User", userSchema);