const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const { v4: uuidV4 } = require("uuid");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const rooms = {};

const peerServer = ExpressPeerServer(server, {
    path: "/",
});
app.use("/peerjs", peerServer);

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
        port: PORT,
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

server.listen(PORT, () => console.log(`server listening at port ${PORT}`));
