const express = require("express");

const app = express();



app.get("/user", (req, res)=>{
    res.send("User created successfully!")
})
app.post("/user", (req,res)=>{
    res.send("User added successfully")
})
app.patch("/user", (rrq,res)=>{
    res.send("User partially added successfully")
})
app.delete("/user", (req,res)=>{
     res.send("User deleted successfully")
})
app.use("/test",(req,res)=>{
    res.send("Hello people")
})



app.listen(7777, ()=>{
    console.log("Server has started")
})