const express = require('express');
const http = require('http')
const socketIO = require('socket.io')
const path = require('path');
const publicPath = path.join(__dirname,'./../public');
const {generateMessage, generateLocationMessage} = require('./utils/message.js');

var port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket)=>{
    console.log('New user connected');
    socket.emit('newMsg',generateMessage('admin', 'Welcome to chat app'));

    socket.broadcast.emit('newMsg',generateMessage('admin', 'New user joined'));

    socket.on('createMsg', (msg, callback)=>{
            console.log('New Msg:',msg)
            io.emit('newMsg',generateMessage(msg.from, msg.text));
            callback('This is sent by server');
    });
    
    socket.on('createLocationMsg', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
      });

    socket.on('disconnect',()=>{
        console.log('user disconnected');
    });
});

app.use(express.static(publicPath));

server.listen(port, ()=> console.log(`started on ${port}`));