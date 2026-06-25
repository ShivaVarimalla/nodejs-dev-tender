const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Meghana",
    lastName: "Varimalla",
    emailId: "meghanabaitigeri@gmail.com",
    password: "1234567890",
    age: "39",
    gender: "Female",
  };

  const user = new User(userObj);
  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Error saving the data", error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(7777, () => {
      console.log("Server has started");
    });
  })
  .catch((err) => {
    console.error("Database not connected:", err.message);
  });
