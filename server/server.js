const express = require('express');
const http = require('http')
const socketIO = require('socket.io')
const path = require('path');
const publicPath = path.join(__dirname,'./../public');
const {generateMessage, generateLocationMessage,generatePrivateInvitation} = require('./utils/message.js');
const {isRealString} = require('./utils/validate');
const {User} = require('./utils/user');
const {privateUser} = require('./utils/privateUser');

var port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new User();
let privateUsers = new privateUser();

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
        if(!isRealString(params.from) || !isRealString(params.to)){
            return callback('Fields required');
        }
        console.log('privateChat')
        let user1 = privateUsers.getUserId(params.from, params.to);
        let user2 = privateUsers.getUserId(params.to, params.from);
        try{
            if(user1 == undefined && user2 == undefined){
                privateUsers.addUser(socket.id, params.from, params.to);
                let user2 = users.getUserId(params.to);
                io.to(user2).emit('privateChatInvitation',generatePrivateInvitation(params.from, params.to));
                socket.emit('newMsg',generateMessage('Admin', 'Welcome to chat app'));
                socket.emit('newMsg',generateMessage('Admin',`Your private chat invitation has been successfully sent to ${params.to}`));
                socket.emit('newMsg', generateMessage('Admin','Invitation hasn\'t been accepted yet'));
            }else{
                privateUsers.addUser(socket.id, params.from, params.to);
                let user2 = privateUsers.getUserPrivateId(params.from, params.to);                
                socket.emit('newMsg',generateMessage('Admin', 'Welcome to chat app'));
                io.to(user2).emit('newMsg',generateMessage('Admin',`Your invitation has been aceepted by ${params.from}`));              
            }
        }catch(err){
            socket.emit('newMsg', generateMessage('Admin', 'Error occured'));
        }
        callback();
    });

    socket.on('createPrivateMsg',(msg, callback)=>{
        let user = privateUsers.getUser(socket.id);
        try{
            let user2 = privateUsers.getUserPrivateId(user.from, msg.to);
            io.to(user2).emit('newMsg', generateMessage(user.from, msg.text));
            socket.emit('newMsg', generateMessage(user.from, msg.text));
            callback();
        }catch(err){
            socket.emit('newMsg',generateMessage('Admin', 'Your invitation has not been accepted'));
            callback()
        }
        
    });

    socket.on('createPrivateLocationMsg',(coords, to)=>{
        let user = privateUsers.getUser(socket.id);
        try{
            let user2 = privateUsers.getUserPrivateId(user.from, to.to);
            if(user && user2){
                io.to(user2).emit('newLocationMessage', generateLocationMessage(user.from, coords.latitude, coords.longitude));            
                socket.emit('newLocationMessage', generateLocationMessage(user.from, coords.latitude, coords.longitude));
            }
        }catch(err){
            socket.emit('newMsg',generateMessage('Admin', 'Your invitation has not been accepted'));
        }
       
    });

    socket.on('createMsg', (msg, callback)=>{
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
        let user = users.getUser(socket.id);
        let privateUser1 = privateUsers.getUser(socket.id);
        if(user){

            users.removeUser(socket.id);
            io.to(user.room).emit('updateUsersList', users.getAllUsers(user.room));
            io.to(user.room).emit('newMsg',generateMessage('Admin',`${user.name} has left `));
            console.log(`${user.name} disconnected(room)`);
        }else if(privateUser1){
            try{
                privateUsers.removeUser(socket.id)                
                let privateUser2Id = privateUsers.getUserPrivateId(privateUser1.from, privateUser1.to);
                io.to(privateUser2Id).emit('newMsg', generateMessage('Admin', `${privateUser1.from} has left`));
                console.log(`${privateUser1.from} disconnected(private)`)

            }catch(err){
                console.log(`${privateUser1.from} disconnected(private)`)
            }
            
        }else{
            console.log('User disconnected');
        }
    });

    socket.on('login', ()=>{
        console.log("log in");
        socket.emit('updateUsersList', users.getAllUsers());
        socket.emit('updateRoomsList', users.getAllRooms());
    })
});

app.use(express.static(publicPath));

server.listen(port, ()=> console.log(`started on ${port}`));