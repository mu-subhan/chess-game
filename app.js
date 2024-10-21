const express = require("express");
const app = express();


app.get("/",function(req,res){
    res.send("it is working ")
})

app.listen(5000);