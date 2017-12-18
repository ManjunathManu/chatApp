const express = require('express');
const http = require('http')
const socketIO = require('socket.io')
const path = require('path');
const publicPath = path.join(__dirname,'./../public');
const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const {isRealString} = require('./utils/validate');
const {User} = require('./utils/user');

var port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new User();

io.on('connection', (socket)=>{
    console.log('New user connected');

    socket.on('join',(params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('name and room name required');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
         
        io.to(params.room).emit('updateUsersList',users.getAllUsers(params.room));

       socket.emit('newMsg',generateMessage('Admin', 'Welcome to chat app'));
       socket.broadcast.to(params.room).emit('newMsg',generateMessage('Admin', `${params.name} joined`));
            callback();
        
    });

    socket.on('createMsg', (msg, callback)=>{
            //console.log('New Msg:',msg)
            var user = users.getUser(socket.id);
            if(user && isRealString(msg.text)){
            io.to(user.room).emit('newMsg',generateMessage(user.name, msg.text));
            
            }
            callback('This is sent by server');
    });
    
    socket.on('createLocationMsg', (coords) => {
        var user = users.getUser(socket.id);
        if(user){
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        
        }
      });

    socket.on('disconnect',()=>{
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUsersList', users.getAllUsers(user.room));
            io.to(user.room).emit('newMsg',generateMessage('Admin',`${user.name} has left `))
        }
        console.log('user disconnected');
    });
});

app.use(express.static(publicPath));

server.listen(port, ()=> console.log(`started on ${port}`));