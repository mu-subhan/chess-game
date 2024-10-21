const express = require("express");
const socket = require("socket.io");
const http = require("http");
const {Chess} = require("chess.js");
const path = require("path");
const { title } = require("process");





const app = express();
const server = http.createServer(app);



const io = socket(server);

const chess = new Chess();
// set variables
let players ={};
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")))

app.get("/",(req,res)=>{
    res.render("index",{title: "Chess game"})
})

io.on("connection",function (uniquesocket){
    console.log("connected");
    
    // for reciving write code
    // uniquesocket.on("churan",function(){
        // console.log("churan recieved");
        // io.emit("churan paapdi"); // to send all reciever include sender
        
  
        // disconnection 
        // uniquesocket.on("disconnet",function(){
        //     console.log("disconnected");
            
        // })
    
});



server.listen(5000 ,()=>{
    console.log("Listning on 5000");
    
});