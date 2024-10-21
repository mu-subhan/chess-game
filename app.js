const express = require("express");
const socket = require("socket.io");
const http = require("http");
const {Chess} = require("chess.js");
const path = require("path");
const { title } = require("process");
const { log } = require("console");





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

io.on("connection",function(uniquesocket){
    console.log("connected");
 
    //define the role 
    if(!players.white){
        players.white = uniquesocket.id;
        uniquesocket.emit("playerRole","W");

    } else if (!players.black){
        players.black = uniquesocket.id;
        uniquesocket.emit("playerRole","b");
    } else {
        uniquesocket.emit("spectatorRole");
    }
  
    uniquesocket.on("disconnect",function(){
    if(uniquesocket.id === players.white){
        delete players.white;
    } else if(uniquesocket.id === players.black){
        delete players.black;
    }
    });
  
    // for updatation

    uniquesocket.on("move",(move) =>{
        try {
            if (chess.turn() === "w" && uniquesocket.id !== players.white) return;
            if (chess.turn() === "b" && uniquesocket.id !== players.black) return;

            const result = chess.move(move);
            if(result){
                currentPlayer = chess.turn();
                io.emit("move",move);
                io.emit("boardState",chess.fen())
            }
            else{
                console.log("Invalid move :",move);
                uniquesocket.emit("invalidMove",move);
                
            }

        } catch (error) {
            console.log(error);
            uniquesocket.emit("Invalid move : ",move)
            
        }
    })

})


server.listen(5000 ,()=>{
    console.log("Listning on 5000");
   
} );   






    // io.on("connection",function (uniquesocket){
    //     console.log("connected");
        
        // for reciving write code
        // uniquesocket.on("churan",function(){
            // console.log("churan recieved");
            // io.emit("churan paapdi"); // to send all reciever include sender
            
      
            // disconnection 
            // uniquesocket.on("disconnet",function(){
            //     console.log("disconnected");
                
            // })
        
//     });
// })