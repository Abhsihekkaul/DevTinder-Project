const express = require("express");
const { userAuth } = require("../middleware/Auth");
const RequestRouter = express.Router();

RequestRouter.post("/sendRequest", userAuth,(req,res)=>{
    res.send("send the request successfully")
})

module.exports = RequestRouter;