const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is invalid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is invalid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const editFieldsAllowed = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "phoneNumber",
    "photoUrl",
    "about",
    "interests",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    editFieldsAllowed.includes(field)
  );
  if (isEditAllowed) {
    const gender = req.body?.gender;
    if (!validator.isNumeric(req.body.phoneNumber)) {
      throw new Error("Invalid Phone Number");
    } else if (!validator.isNumeric(req.body.age)) {
      throw new Error("Invalid Age");
    } else if (!validator.isURL(req.body.photoUrl)) {
      throw new Error("Invalid Picture");
    } else if (!validator.isAlpha(req.body.firstName)) {
      throw new Error("Only alphabets are allowed in first Name");
    } else if (!validator.isAlpha(req.body.lastName)) {
      throw new Error("Only alphabets are allowed in last Name");
    } else if (!validator.isAlpha(gender)) {
      if (
        gender.toLowerCase() !== "male" ||
        gender.toLowerCase() !== "female" ||
        gender.toLowerCase() !== "other"
      ) {
        throw new Error("invalid gender");
      }
    }
  }
  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
