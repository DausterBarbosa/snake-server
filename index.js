require('dotenv').config();

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

function generateFood(){
    return {
        x: Math.floor(Math.random() * 15 + 1) * 32,
        y: Math.floor(Math.random() * 15 + 1) * 32,
    }
}

socket.on("connection", connected => {
    socket.emit("generateFood", generateFood());

    connected.on("position", (position) => {
        connected.broadcast.emit("enemyposition", position)
    });

    connected.on("comidacapturada", () => {
        socket.emit("generateFood", generateFood());
    });

    connected.on("enemypoint", () => {
        connected.broadcast.emit("enemypoint");
    });
});

server.listen(process.env.PORT || 3000);