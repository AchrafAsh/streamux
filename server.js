const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

const rooms = {};

const peerPort = 9999;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    const roomId = uuidV4();
    rooms[roomId] = 0;
    return res.redirect(`/${roomId}`);
});

app.get("/:room", (req, res) => {
    rooms[req.params.room] += 1;
    console.log({ rooms });
    return res.render("index", {
        roomId: req.params.room,
        streaming: rooms[req.params.room],
        port: peerPort,
    });
});

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);

        socket.on("disconnect", () => {
            socket.to(roomId).broadcast.emit("user-disconnected", userId);
        });
    });
});

server.listen(3000);
