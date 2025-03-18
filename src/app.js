require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
const User = require("./models/user");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouter } = require("./routes/user");

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
