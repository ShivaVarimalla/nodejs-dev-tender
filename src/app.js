const express = require("express");

const app = express();

app.use("/people",(req,res)=>{
    res.send("Shiva, Meghana, Sitara ")
})
app.use("/test",(req,res)=>{
    res.send("Hello people")
})
app.use("/",(req,res)=>{
    res.send("Hello from dashboard")
})


app.listen(7777, ()=>{
    console.log("Server has started")
})