const mongoose = require("mongoose");

const url =
  "mongodb+srv://dtdevanshtyagi:Nt9Sw8zklj3xQVkz@cluster0.5s0wo.mongodb.net/devTinder";
const connectDB = async () => {
  await mongoose.connect(url);
};

module.exports = connectDB;
