const express = require("express");

const app = express();
const {adminAuth, userAuth} = require("./Middlewares/auth")

app.use("/admin", adminAuth)

app.get("/admin/getAllData",(req,res)=>{
res.send("I am admin, let me move forward")
})

app.use("/user", userAuth)
app.get("/user/qws", (req, res, ) => {
  res.send("1st User created successfully!");
  // next()
},
);

app.listen(7777, () => {
  console.log("Server has started");
});
