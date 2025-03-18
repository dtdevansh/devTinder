const express = require("express");

const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE =
  "firstName lastName photoUrl age gender about interests skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requestReceived = await connectionRequest
      .find({
        toUserId: loggedInUser,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE);
    res.json({ data: requestReceived });
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});

userRouter.get("/user/requests/sent", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requestSent = await connectionRequest
      .find({
        fromUserId: loggedInUser,
        status: "interested",
      })
      .populate("toUserId", USER_SAFE);
    res.json({ data: requestSent });
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await connectionRequest
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE)
      .populate("toUserId", USER_SAFE);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json({ data: data });
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const allConnectionRequest = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");

    const hiddenUsers = new Set();
    allConnectionRequest.forEach((req) => {
      hiddenUsers.add(req.fromUserId.toString());
      hiddenUsers.add(req.toUserId.toString());
    });

    console.log(hiddenUsers);
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE)
      .skip(skip)
      .limit(limit);

    console.log("Users : " + users);

    res.json({ data: users });
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});
module.exports = { userRouter };
