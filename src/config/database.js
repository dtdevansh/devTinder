const mongoose = require("mongoose");

const url = process.env.DB_SECTRET_URL;
const connectDB = async () => {
  await mongoose.connect(url);
};

module.exports = connectDB;
