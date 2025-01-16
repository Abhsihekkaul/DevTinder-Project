const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.get("/greeting", (req, res) => {
    res.send("Hello, world! How are you?");
});

app.listen(3000, () => {
    console.log("The app is listening on port 3000");
});
