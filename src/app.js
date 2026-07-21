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
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const deleteUser = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// app.patch("/user", async (req, res) => {
//   const userId = req.body.userId;
//   const data = req.body;

//   try {
//     const user = await User.findByIdAndUpdate(userId , data, {returnDocument: "after"});
//     console.log("userrr", user)
//     res.send("User updated successfully");
//   } catch (error) {
//     res.status(500).send("Something went wrong");
//   }
// });

app.patch("/user", async (req, res) => {
  const emailId = req.body.emailId;
  const data = req.body;

  console.log("Request Body:", req.body);

  try {
    const user = await User.findOneAndUpdate(
      { emailId },
      data,
      { new: true }
    );

    console.log("Updated User:", user);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
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
