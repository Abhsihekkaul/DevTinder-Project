const express = require("express");
const ConnectDB = require("../utils/database");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./Routes/auth.js")
const ProfileRoutes = require("./Routes/Profile.js");
const RequestRouter = require("./Routes/Request.js");

// Middleware
app.use(express.json());
app.use(cookieParser());

// adding the auth middleware 
app.use('/', authRouter);
// adding the Profile middleware
app.use('/', ProfileRoutes)
// adding the Request middleware
app.use('/', RequestRouter);

// Connect to database and start server
ConnectDB()
    .then(() => {
        console.log("Connected to DB Successfully");
        app.listen(3000, () => {
            console.log("The app is listening on port 3000");
        });
    })
    .catch((err) => {
        console.log("Connection not established: " + err);
    });
