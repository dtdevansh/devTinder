const express = require("express");

const { adminAuth, userAuth } = require("./middlewares/auth");

const port = 7777;
const app = express();

app.use("/user", express.json(), userAuth);

app.get("/user", (req, res) => {
  res.send({ name: "Devansh Tyagi", gender: "male" });
});

app.post("/user", (req, res) => {
  res.send("User saved succesfully");
});

app.patch("/user", (req, res) => {
  res.send("User updated succesfully");
});

app.delete("/user", (req, res) => {
  res.send("User deleted succesfully");
});

app.use("/admin", express.json(), adminAuth);

app.get("/admin", (req, res) => {
  res.send({ name: "Devansh Tyagi", gender: "male" });
});

app.delete("/admin", (req, res) => {
  res.send("Admin deleted succesfully");
});

app.use("/", (req, res) => {
  res.send("Welcome to the Dashboard");
});

app.listen(port, () => {
  console.log("Server is started and listening on port:" + port);
});
