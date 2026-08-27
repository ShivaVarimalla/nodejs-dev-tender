require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const connectDB = require("./config/database");
const User = require("./models/user");
const {
  validateSignUpData,
  validateEditProfileData,
  validateLoginData,
} = require("./utils/validation");

const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./Middlewares/auth");
const authRouter = require("./routes/auth");
const profieRouter = require("./routes/profile")
const userRouter = require("./routes/user")

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profieRouter);
app.use("/", userRouter)
const errorHandler = require("./Middlewares/errorHandler");

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "Up",
    message: "Server is running fine",
    timeStamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 7777;

connectDB()
  .then(() => {
    console.log("DB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server has started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB connection error:", error.message);
    process.exit(1);
  });
