const jwt = require("jsonwebtoken");

const User = require("../models/user");

const secret = process.env.JWT_SECRET;

const userAuth = async (req, res, next) => {
  console.log("User auth is getting checked");
  try {
    const { token } = req.cookies;

    const decodedObj = await jwt.verify(token, secret);
    const userId = decodedObj._id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(401).send("Unauthorized request");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Token is not Vailid" + err.message);
  }
};

module.exports = {
  userAuth,
};
