const express = require("express");
const ProfileRoutes = express.Router();
const { userAuth } = require("../middleware/Auth.js");
const validateEditors = require("../../utils/validation.js");

ProfileRoutes.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("User does not exist");
        }
        res.send(user);
    } catch (err) {
        res.status(400).send("You are not Logged in , err : " + err.message);
    }
});


ProfileRoutes.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateEditors(req)){
            throw new Error(
                "invalid edit request"
            )
        }
        const LoggedInUser = req.user;

        // through the following logged in user will got updated through the req.body
        Object.keys(req.body).forEach((key) => {
            LoggedInUser[key] = req.body[key];
        });
        
        await LoggedInUser.save();
        res.send(`${LoggedInUser.firstName}, your profile edited successfully`);
    }catch(err){
        res.send(err);
    }
});



module.exports = ProfileRoutes;