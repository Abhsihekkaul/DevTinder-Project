const mongoose = require("mongoose")

const userSchema =  new mongoose.Schema({
    firstName : {
        type: String,
        required : true,
        trim : true,
        min : 3,
        max : 25
    },
    lastName : {
        type: String,
        trim : true,
        min : 3,
        max : 25
    },
    Email : {
        type: String,
        required: true,
        unique : true,
        lowercase : true,
        validate: {
          validator: function (value) {
            // the following is the regEx expression for the email pattern validation
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Validates general email format
          },
          message: "Invalid email format.",
        },
      },
    password : {
        type: String,
        required : true,
        min : 8,
        validate: {
            validator: function (value) {
              // Reject passwords containing any whitespace
              return !/\s/.test(value); 
            },
            message: 'Password should not contain spaces.',
          },
    },
    Age:{
        type : Number,
        min : 18
    },
    Skills : {
        type : [String],
        trim : true,
        // we also have the default option which we can add as anything we want 
        default : ["javascript", "html", "Css"]
    },
    Gender : {
        type : String,
        lowercase : true,
        validate(value){
            if(!["male","female","other","others"].includes(value)){
                throw new Error("The Gender data filled is invalid");
            }
        }
    }

});

module.exports = mongoose.model("User", userSchema);