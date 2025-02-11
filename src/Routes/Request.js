const express = require("express");
const { userAuth } = require("../middleware/Auth");
const RequestRouter = express.Router();
const User = require("../../Models/user.js");
const ConnectionRequest = require("../../Models/connectionRequest.js");

RequestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const allowedStatuses = ["ignored", "interested"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status provided." });
        }

        if (fromUserId.equals(toUserId)) {
            return res.status(400).json({ message: "You cannot send a request to yourself." });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found." });
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingRequest) {
            return res.status(409).json({ message: "A connection request already exists between these users." });
        }

        const newRequest = new ConnectionRequest({ fromUserId, toUserId, status });
        await newRequest.save();

        return res.status(201).json({
            message: `${req.user.firstName} sent a ${status} request to ${toUser.firstName}.`
        });

    } catch (err) {
        console.error("Error sending connection request:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

module.exports = RequestRouter;
