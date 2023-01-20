const socket = io("/");
const videoGrid = document.getElementById("video-grid");

const myPeer = new Peer();

const myVideo = document.createElement("video");
myVideo.muted = true;
const peers = {};

if (STREAMING == 1) {
    navigator.mediaDevices
        .getUserMedia({
            video: true,
            audio: false,
        })
        .then((stream) => {
            addVideoStream(myVideo, stream);

            myPeer.on("call", (call) => {
                call.answer(stream);
            });

            socket.on("user-connected", (userId) => {
                connectToNewUser(userId, stream);
            });
        });
} else {
    // Getting the remote remote stream and adding it to the DOM
    myPeer.on("call", (call) => {
        call.answer(undefined);
        const video = document.createElement("video");
        video.muted = true;
        call.on("stream", (remoteStream) => {
            addVideoStream(video, remoteStream);
        });
    });
    socket.on("user-connected", (userId) => {
        connectToNewUser(userId, undefined);
    });
}

socket.on("user-disconnected", (userId) => {
    if (peers[userId]) {
        peers[userId].close();
    }
});

myPeer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");
    video.muted = true;

    call.on("stream", (remoteStream) => {
        addVideoStream(video, remoteStream);
    });
    call.on("close", () => {
        video.remove();
    });

    peers[userId] = call;
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    console.log({ stream });
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });
    videoGrid.append(video);
}
