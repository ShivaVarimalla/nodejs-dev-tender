const express = require("express");

const app = express();


app.get("/user", (req, res) => {
 try {
   throw new Error;
 } catch (error) {
  res.status(500).send("Internal server error")
 }
 
});

app.use("/", (err,req,res, next)=>{
 if(err){
  res.status(500).send("Something went wrong")
 }
})


app.listen(7777, () => {
  console.log("Server has started");
});
