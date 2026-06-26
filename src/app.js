const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json())

app.post("/signup", (req, res) => {
  const user = new User(req.body);
  user.save();

  res.send("Usre data added succesfully")
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
// app.listen(7777, () => {
//   console.log("Server has started");
// });
