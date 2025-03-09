const express = require("express");

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");
const User = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData) {
      throw new Error("Edit is not allowed!");
    }
    const loggedUser = await User.findById(req.user._id);
    console.log(loggedUser);

    Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));
    await loggedUser.save();

    res.json({
      message: `${loggedUser.firstName}, Your profile has been updated`,
      data: loggedUser,
    });
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});

module.exports = profileRouter;
