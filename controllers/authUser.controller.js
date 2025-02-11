const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require('../Models/user')

async function HandleSignup(req,res){
    try{

        // part 1 - handling the data coming from the req.body or by the user input
        const {firstName, lastName, Email, password} = req.body;

        if(!validator.isEmail(Email)){
            throw new Error("Invalid Email");
        }

        if(!validator.isStrongPassword(password)){
            throw new Error("The password you are trying to set is not strong");
        }

        if(!firstName || !lastName){
            throw new Error("Please Enter the valid FirstName and LastName")
        }

        // part 2 - hash the password before saving the new user
        const hashPassword =  await bcrypt.hash(password,10);

        // part 3 - saving the all user fields along with the hash password
        const user = new User({
            firstName,
            lastName,
            password: hashPassword,
            Email
        });

        await user.save();
        res.send("User added successfully"); 
    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
}

async function HandleLogOut(req,res){
    res.cookie("token", null, {expiresIn : new Date(Date.now())},)
    res.send("Logged out successfully");
}

async function HandleLogIn(req,res){
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
}

module.exports ={ HandleSignup, HandleLogOut, HandleLogIn};