const express = require("express");

const app = express();


//localhost:7777/user/101/shiva
app.get("/user/:userId/:name", (req,res)=>{
    console.log({...req.params});
    res.send("User created successfully!")
})

//localhost:7777/user/:userId=101&name=shiva
app.get("/user", (req, res)=>{
    console.log({...req.query})
    res.send("User created successfully!")
})


app.use("/test",(req,res)=>{
    res.send("Hello people")
})



app.listen(7777, ()=>{
    console.log("Server has started")
})