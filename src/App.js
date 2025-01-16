const express = require("express");
const app = express();

const Name = "Abhishek";
const Friend = "Bhavesh";

app.use("/greeting", (req, res) => {
    res.send("Hello, world! How are you " + Name + " ?");
});

app.use("/FriendGreet", (req, res) => {
    res.send("Hello " +  Friend );
});

app.use("/", (req, res) => {
    res.send("Hello, world!");
});

app.listen(3000, () => {
    console.log("The app is listening on port 3000");
});
