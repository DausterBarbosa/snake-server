const express = require("express");
const http = require("http");
const io = require("socket.io");
const app = express();
const server = http.createServer(app);
const socket = io(server, {
    cors: {
        origin: "*"
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