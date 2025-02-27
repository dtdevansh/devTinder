const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const port = 7777;
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added succesfully");
  } catch (err) {
    res.status(400).send("Error saving the user " + err.message);
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
