const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../Models/user.js")
const bcrypt = require("bcrypt");
const validator = require("validator");


authRouter.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, Email, password } = req.body;

        if (!validator.isEmail(Email)) {
            throw new Error("Email is not valid");
        }
        if (!firstName || !lastName) {
            throw new Error("Invalid First or Last Name");
        }
        if (!validator.isStrongPassword(password)) {
            throw new Error("Password is not strong!");
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            password: passwordHash,
            Email
        });

        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { Email, password } = req.body;

        if (!validator.isEmail(Email)) {
            throw new Error("Email is not valid");
        }
        if (!password) {
            throw new Error("Please enter your password");
        }

        const user = await User.findOne({ Email });
        if (!user) {
            throw new Error("User not found");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error("Invalid password");
        }

        // Generate token
        const token = jwt.sign({ _id: user._id }, "MotherFucker123", { expiresIn: "1d" });

        // Secure cookie settings
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });

        res.send("Login successful!");
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

authRouter.post("/logout", async (req,res)=>{
    res.cookie("token", null, {expiresIn : new Date(Date.now())},)
    res.send("Logged out successfully");
})
module.exports = authRouter;