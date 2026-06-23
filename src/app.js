const express = require("express");

const app = express();

//localhost:7777/user?userId=101&name=shiva
app.get("/user", (req, res, next) => {
//   res.send("1st User created successfully!");
  next()
},
[(req, res, next) => {
    // res.send("2nd User created successfully!");
    next()
  },
  (req,res, next)=>{
    res.send("3rd user created")
    next()
  }]
);

app.listen(7777, () => {
  console.log("Server has started");
});
