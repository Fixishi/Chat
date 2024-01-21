const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket) {
    socket.on("newuser", function(username) {
        socket.broadcast.emit("update", username + " se připojil k chatu.");
    });
    socket.on("leftuser", function(username) {
        socket.broadcast.emit("update", username + " opustil chat.")
    });
    socket.on("chat", function(message) {
        socket.broadcast.emit("chat", message);
    });
});

server.listen(port, () => {
    console.log(`Server běží na http://localhost:3000`);
});