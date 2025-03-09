const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");

const User = require("../models/user");
const { validateSignUpData } = require("../utils/validations");

const authRouter = express.Router();
const secret = "SecurityTokenByJWT@devTinder11";

authRouter.post("/signup", async (req, res) => {
  try {
    //Validations
    validateSignUpData(req);

    //Hashing of password
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const userExist = await User.find({ emailId: emailId });
    if (userExist.length === 1) {
      res.send("User already exists with this email ID");
    } else {
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
      });
      await user.save();
      res.send("User added succesfully");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Email is invalid!");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("The Email or Password is not correct!");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT(secret);
      // Add token to cookie
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send("Login Succesfull");
    } else {
      throw new Error("The Email or Password is not correct!");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(Date.now()),
  });
  res.send("logout Succesfull!!");
});

module.exports = authRouter;
