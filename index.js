const express = require("express");
const cors = require("cors");
const http = require("http");
const io = require("socket.io");
const app = express();

app.use(cors());

const server = http.createServer(app);
const socket = io(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

users = 0;

socket.on("connection", conected => {
    users++;

    if(users == 1){
        socket.emit("aguardandooponente", {
            status: true,
        });
    }
    else {
        conected.broadcast.emit("aguardandooponente", {
            status: false,
        });
    }

    conected.on("disconnect", () => {
        conected.broadcast.emit("aguardandooponente", {
            status: true,
        });
        users--;
    });

    conected.on("position", position => {
        conected.broadcast.emit("enemyposition", position);
    });
});

server.listen(8888);