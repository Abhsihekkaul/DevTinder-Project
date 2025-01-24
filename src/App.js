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
        const user = await User.findOneAndUpdate({Email : emailId}, data, {returnDocument : "after", new : true});
        console.log(user);
        res.send("User Updated successfully");
    }catch(err){
        res.status(404).send("Id does not found ")
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
