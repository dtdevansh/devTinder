const mongoose = require("mongoose");

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
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 30,
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
    },
    about: {
      type: String,
      default: "Hey i am New on devTinfer and want to make cool friends",
      trim: true,
      lowercase: true,
    },
    interests: {
      type: String,
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

const User = mongoose.model("User", userschema);

module.exports = User;
