const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", (req, res) => {
  const user = new User(req.body);
  user.save();

  res.send("Usre data added succesfully");
});

app.get("/user", async (req, res) => {
  const email = req.query.emailId;
  try {
    const user = await User.findOne({ emailId: email });
    if (!user) {
      res.status(404).send("user doesn'texist");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).send("Something went wrong!");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("users doesn'texist");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send("user doesn'texist");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).send("Something went wrong!");
  }
});

connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(7777, () => {
      console.log("Server has started");
    });
  })
  .catch((error) => {
    console.log("DB connection err", error);
  });
