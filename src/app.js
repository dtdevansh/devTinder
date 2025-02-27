const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const port = 7777;
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const userExist = await User.find({ emailId: req.body.emailId });
  if (userExist.length === 1) {
    res.send("User already exists with this email ID");
  } else {
    const user = new User(req.body);
    try {
      await user.save();
      res.send("User added succesfully");
    } catch (err) {
      res.status(400).send("Error saving the user " + err.message);
    }
  }
});

app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    if (!allUsers) {
      res.send("No user found");
    } else {
      res.send(allUsers);
    }
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ emailId: req.body.emailId });
    // if (user.length === 0) {
    //   res.send("User does not exists with this email ID");
    // }
    res.send("User deleted succesfully");
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

app.patch("/user", async (req, res) => {
  try {
    const data = req.body;
    const newUser = await User.findOneAndUpdate(
      { emailId: req.body.emailId },
      data,
      {
        returnDocument: "after",
      }
    );
    res.send("User updated successfully " + newUser);
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(port, () => {
      console.log("Server is started and listening on port:" + port);
    });
  })
  .catch((err) => {
    console.error("Database connection failed..");
  });
