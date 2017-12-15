const express = require('express');
const http = require('http')
const socketIO = require('socket.io')
const path = require('path');
const publicPath = path.join(__dirname,'./../public');

var port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket)=>{
    console.log('New user connected');
    socket.on('disconnect',()=>{
        console.log('user disconnected');
    });
});

app.use(express.static(publicPath));

server.listen(port, ()=> console.log(`started on ${port}`));