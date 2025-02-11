const express = require("express");
const authRouter = express.Router();
const {HandleSignup, HandleLogOut, HandleLogIn} = require('../../controllers/authUser.controller.js');


authRouter.post("/signup",HandleSignup);

authRouter.post("/login", HandleLogIn);

authRouter.post("/logout", HandleLogOut);

module.exports = authRouter;