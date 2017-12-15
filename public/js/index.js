var socket = io();
socket.on('connect',function (){
    console.log('connected to server')

    socket.emit('createMsg',{"to":"vp","text":"how u doing?"});
   
});

socket.on('newMsg',function (data){
    console.log('New msg arrives',data);
})

socket.on('disconnect', function (){console.log('disconnected from server')});