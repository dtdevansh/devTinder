const express = require("express");

const port = 7777;
const app = express();

app.use("/", (req, res) => {
  res.send("Welcome to the Dashboard");
});

app.use("/test", (req, res) => {
  res.send("Welcome to the Test page");
});

app.listen(port, () => {
  console.log("Server is started and listening on port:" + port);
});
