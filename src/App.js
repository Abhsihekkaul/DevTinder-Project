const express = require("express");
const ConnectDB = require("../utils/database");
const app = express();
const User = require("../Models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.get("/", (req,res)=>res.send("Hello world") )

// adding the json middleware (so that error wont occur)
app.use(express.json());

// adding the middleware to add cookie
app.use(cookieParser());

// Api to get the user thorugh his email
app.get("/userByEmail",async (req,res)=>{
    const userEmail = req.body.email;

    try{
        const user = await User.find({Email : userEmail});
        if(user.length == 0){
            res.status(404).send("user does not found!");
        }else{
            res.send(user);
        }
    }catch(err){
        console.log(err);
    }
})

// Post API - for adding a new user to the database
app.post("/signup", async (req, res) => {
    try{
        // validate your user 
        const {firstName, lastName, Email, password} = req.body;
        const isValidEmail = validator.isEmail(Email);
        const isStrongPassword = validator.isStrongPassword(password);
        if(!isValidEmail){
            throw new Error("Email is not Valid");
        }
        if(!firstName || !lastName){
            throw new Error("Invalid First or Last Name");
        }
        if(!isStrongPassword){
            throw new Error("Password is not strong!");
        }
        
        
        //encrypt your password 
        const passwordHash = await bcrypt.hash(password , 10); //password is the password and 10 are the salt rounds

        const user = new User({
            firstName,
            lastName,
            password : passwordHash,
            Email
        });

        console.log(user);
        
            await user.save();
            res.send("User added successfully")
        }catch (err){
            res.status(400).send("oops error occurred "+err.message);
        }
        
});

// Post API - for Login a user
app.post("/login", async (req, res) => {
    try {
        // Extract email and password from the request body
        const { Email, password } = req.body;

        // Validate if the provided email is in a proper format
        if (!validator.isEmail(Email)) {
            throw new Error("Email is not valid");
        }

        // Ensure that a password is provided
        if (!password) {
            throw new Error("Please enter your password");
        }

        // Find the user in the database based on the email
        const user = await User.findOne({ Email });

        // If no user is found, return an error
        if (!user) {
            throw new Error("User not found");
        }

        // Compare the entered password with the stored hashed password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error("Invalid password");
        }

        // Generate a JWT token containing the user's ID
        const token = jwt.sign({ _id: user._id }, "MotherFucker123", {
            expiresIn: "1d", // Set token expiration to 1 day
        });

        // Store the token in an HTTP-only cookie (prevents client-side JavaScript access)
        res.cookie("token", token);

        // Send a success response
        res.send("Login successful!");
    } catch (err) {
        // Send an error response if any issue occurs
        res.status(400).send("Oops, error occurred: " + err.message);
    }
});



app.get("/profile", async (req, res) => {
    try {
        // Extract token from cookies
        const { token } = req.cookies;

        // If no token is found, return an error
        if (!token) {
            throw new Error("No token provided");
        }

        // Verify the token using the secret key
        const decoded = jwt.verify(token, "MotherFucker123");

        // Extract the user ID from the decoded token
        const { _id } = decoded;

        // Retrieve user details from the database using the user ID
        const user = await User.findById(_id);

        // If the user is not found, return an error
        if (!user) {
            throw new Error("User does not exist");
        }

        // Send the user's details as a response
        res.send(user);
    } catch (err) {
        // Send an error response if any issue occurs
        res.status(400).send("Error: " + err.message);
    }
});




// Api for creating a user and delete that user through the database 
app.delete("/user", async (req,res)=>{
    const UserId = req.body._id;
    try{
        await User.findByIdAndDelete({_id:UserId});
        res.send("User Deleted successfully");
    }catch (err){
        res.status(404).send("The User with given id does not exist ");
    }

})

// Feed Api - Get /Feed - to get the all profiles from the database 
app.get("/feed", async (req,res)=>{
     const users = await User.find();
     if(users.length == 0){
        users.status(404).send("No users are here!")
     }else{
        res.send(users);
     }
})

// update the user with id
app.patch("/user/id", async (req, res)=>{
    const UserId = req.body._id;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate(UserId, data, {returnDocument : "after"});
        console.log(user);
        res.send("User Updated successfully");
    }catch(err){
        res.status(404).send("Id does not found ")
    }
})

// update the user with email (HomeWorkk)
app.patch("/user/email", async (req, res)=>{
    const emailId = req.body.Email;
    const data = req.body;
    try{
        // data sanitization - only updating the ones which could be 
        const Allowed_updates = ["userName", "lastName", "skills", "Age", "Gender"];
        const isUpdateAllowed = Object.keys(data).every((k)=>Allowed_updates.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Invalid Updates!");
        }

        // data sanitization - skills can not be added more than 10
        if(req.body.Skills.length > 10){
            throw new Error("Skills can not be more than 10")
        }
        const user = await User.findOneAndUpdate({Email : emailId}, data, {returnDocument : "after", new : true,runValidators: true}); //run Validators will now be into the usage whenever we will make changes to our existing users 
        console.log(user);
        res.send("User Updated successfully");
    }catch(err){
        res.status(404).send(err);
    }
})

ConnectDB()
    .then((result) => {
        console.log("Connected to DB Successfully");
        app.listen(3000, () => {
            console.log("The app is listening on port 3000");
        });
    })
    .catch((err) => {
        console.log("Connection not established: " + err);
    });
