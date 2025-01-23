const express = require("express");
const ConnectDB = require("../utils/database");
const app = express();
const User = require("../Models/user");


app.get("/", (req,res)=>res.send("Hello world") )

// adding the json middleware (so that error wont occur)
app.use(express.json());

// Api to get the user thorugh his email
app.get("/userByEmail",async (req,res)=>{
    const userEmail = req.body.email;

    try{
        const user = await User.find({Email : userEmail});
        res.send(user);
    }catch(err){
        console.log(err);
    }
})

// Post API - for adding a new user to the database
app.post("/signup", async (req, res) => {
        const user = new User(req.body);
        console.log(req.body);
        // Save the user to the database
        try{
            await user.save();
            res.send("User added successfully")
        }catch (err){
            res.status(400).send("oops error occurred "+err.message);
        }
        
});

// Feed Api - Get /Feed - to get the all profiles from the database 
app.get("/feed", async (req,res)=>{
     const users = await User.find();
     res.send(users);
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
