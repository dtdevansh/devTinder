const express = require("express");
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");
const User = require("../models/user");
const user = require("../models/user");

const profileRouter = express.Router();

const USER_SAFE =
  "firstName lastName photoUrl age gender about interests skills";

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(USER_SAFE);
    res.json({ data: user });
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

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const user = req.user;
    const isPasswoordValid = await user.validatePassword(password);
    if (!isPasswoordValid) {
      throw new Error("Current password is not valid");
    } else {
      user.password = await bcrypt.hash(newPassword, 10);
      user.save();
      res.json({
        message: `Hey ${user.firstName}, your Password is changed succesfully`,
      });
    }
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
});

module.exports = profileRouter;
