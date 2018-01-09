const express = require('express');
const http = require('http')
const socketIO = require('socket.io')
const path = require('path');
const publicPath = path.join(__dirname,'./../public');
const {generateMessage, generateLocationMessage,generatePrivateInvitation} = require('./utils/message.js');
const {isRealString} = require('./utils/validate');
const {User} = require('./utils/user');

var port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new User();
let privateUsers = new User();

io.on('connection', (socket)=>{
    console.log('New user connected');
    socket.on('join',(params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('name and room name required');
        }
        
        socket.join(params.room);        
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
         
        io.to(params.room).emit('updateUsersList',users.getAllUsersInRoom(params.room));
        socket.emit('newMsg',generateMessage('Admin', 'Welcome to chat app'));
        socket.broadcast.to(params.room).emit('newMsg',generateMessage('Admin', `${params.name} joined`));
        callback();
        
    });

    socket.on('privateChat',(params, callback)=>{
        console.log('privateChat')
        // console.log(socket.id);
        if(params.room){
            privateUsers.addUser(socket.id, params.name, params.room);
            let user2 = users.getUserId(params.room);
            io.to(user2).emit('privateChatInvitation',generatePrivateInvitation(params.name, params.room));
        
        }else{
            privateUsers.addUser(socket.id,params.name,params.user2);
        }
        // console.log('user2', user2);
        socket.emit('newMsg',generateMessage('Admin', 'Welcome to chat app'));
        callback();
    });

    socket.on('createPrivateMsg',(msg, callback)=>{
        let user = privateUsers.getUser(socket.id);
        console.log(user.name, msg.to)
        try{
            let user2 = privateUsers.getUserPrivateId(user.name, msg.to);
            console.log(user2)
            io.to(user2).emit('newMsg', generateMessage(user.name, msg.text));
            socket.emit('newMsg', generateMessage(user.name, msg.text));
        }catch(err){
            socket.emit('newMsg',generateMessage('Admin', 'Your invitation has not been accepted'));
        }
        
    });

    socket.on('createPrivateLocationMsg',(coords, to)=>{
        let user = privateUsers.getUser(socket.id);
        console.log(to.to);
        try{
            let user2 = privateUsers.getUserPrivateId(user.name, to.to);
            console.log(user2)    
            if(user && user2){
                io.to(user2).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));            
                socket.emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
            }
        }catch(err){
            socket.emit('newMsg',generateMessage('Admin', 'Your invitation has not been accepted'));
        }
       
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

    socket.on('login', ()=>{
        console.log("log in");
        socket.emit('updateUsersList', users.getAllUsers());
        socket.emit('updateRoomsList', users.getAllRooms());
    })
});

app.use(express.static(publicPath));

server.listen(port, ()=> console.log(`started on ${port}`));