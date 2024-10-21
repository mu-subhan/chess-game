const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index", { title: "Chess game" });
});

io.on("connection", (uniquesocket) => {
    console.log("connected");

    // Assign player roles
    if (!players.white) {
        players.white = uniquesocket.id;
        uniquesocket.emit("playerRole", "w");
    } else if (!players.black) {
        players.black = uniquesocket.id;
        uniquesocket.emit("playerRole", "b");
    } else {
        uniquesocket.emit("spectatorRole");
    }

    uniquesocket.on("disconnect", () => {
        if (uniquesocket.id === players.white) {
            delete players.white;
        } else if (uniquesocket.id === players.black) {
            delete players.black;
        }
    });

    uniquesocket.on("move", (move) => {
        try {
            if (chess.turn() === "w" && uniquesocket.id !== players.white) return;
            if (chess.turn() === "b" && uniquesocket.id !== players.black) return;

            const result = chess.move(move);
            if (result) {
                io.emit("move", move);
                io.emit("boardState", chess.fen());
            } else {
                console.log("Invalid move:", move);
                uniquesocket.emit("invalidMove", move);
            }
        } catch (error) {
            console.log(error);
            uniquesocket.emit("Invalid move", move);
        }
    });
});

server.listen(5000, () => {
    console.log("Listening on port 5000");
});





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