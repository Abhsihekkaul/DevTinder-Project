const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserReq : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    toUserReq : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    status:{
        type : String,
        required : true,
        enum : {
            values : ["accepted", "rejected", "intersted" , "ignored"],
            message : `{VALUE} is invalid `
        }
    }
},{
    timestamps: true,
})

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;