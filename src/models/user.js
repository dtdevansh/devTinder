const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userschema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: String,
      maxLength: 50,
      lowercase: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      maxLength: 80,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(`${value} is invalid email`);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error(
            `${value} is not valid gender! Either type Male, Female or Other!`
          );
        }
      },
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    photoUrl: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/user-icons-includes-user-icons-people-icons-symbols-premiumquality-graphic-design-elements_981536-526.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error(`${value} is invalid photoUrl`);
        }
      },
    },
    about: {
      type: String,
      default: "Hey i am New on devTinder and want to make cool friends",
      trim: true,
      lowercase: true,
    },
    interests: {
      type: [String],
      trim: true,
      lowercase: true,
    },
    skills: {
      type: [String],
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

userschema.index({ firstName: 1 });

userschema.methods.getJWT = async function (secret) {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, secret, {
    expiresIn: "8h",
  });
  return token;
};

userschema.methods.validatePassword = async function (inputPassword) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(inputPassword, passwordHash);
  return isPasswordValid;
};

module.exports = mongoose.model("User", userschema);
