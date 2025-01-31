const jwt = require("jsonwebtoken");
const User = require("../../Models/user.js");

const userAuth = async (req, res, next) => {
    try {
        // Corrected: Use req.cookies instead of req.cookie
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Unauthorized! Token missing.");
        }

        // Verify token
        const decodedObj = await jwt.verify(token, "MotherFucker123");
        if (!decodedObj) {
            throw new Error("Invalid token");
        }

        // Find user by ID from decoded token
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("No user found!");
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).send("Authentication error: " + err.message);
    }
};

module.exports = { userAuth };
