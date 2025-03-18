const express = require("express");

const { userAuth } = require("../middlewares/auth");
const user = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;
      if (fromUserId === toUserId) {
        throw new Error("Cannot send a request to self!");
      }
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Status type: ");
      }
      const toUser = await user.findById(toUserId);
      if (!toUser) {
        throw new Error("User Not Found");
      }

      const connectionRequestExists = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (connectionRequestExists) {
        throw new Error("Connection request already exists!");
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: `${loggedInUser.firstName} has ${status} the connection request!`,
      });
    } catch (err) {
      res.status(400).send("ERROR" + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Status type: ");
      }

      const exhistingconnectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!exhistingconnectionRequest) {
        throw new Error("Connection request not found!");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId: exhistingconnectionRequest.fromUserId,
        toUserId: loggedInUser,
        status: status,
      });

      const data = connectionRequest.save();
      res.json({
        message: `${loggedInUser.firstName} ${status} connection request!`,
        data: data,
      });
    } catch (err) {
      res.status(400).send("ERROR" + err.message);
    }
  }
);

module.exports = { requestRouter };
