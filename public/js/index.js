
var socket = io();
socket.on('connect',function (){
    console.log('connected to server')
    // socket.emit('createMsg',{"to":"vp","text":"how u doing?"});
});

socket.on('newMsg',function (msg){
    console.log('New msg arrived',msg);

    var li = jQuery('<li></li>');
    li.text(`${msg.from}:${msg.text}`);
    jQuery('#messages').append(li);
},function(ack){
    console.log('got it',ack);
});

socket.on('disconnect', function (){
    console.log('disconnected from server');
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    socket.emit('createMsg',{from:'User', text:jQuery('[name=message]').val()}, function(){
        jQuery('[name=message]').text('');
    });
});

var geolocation = jQuery("#send-location");

geolocation.on('click',function (){
    if(!navigator.geolocation)
     return alert('Browser does not support geolocaton');

    geolocation.attr('disabled','disabled').text('Sending location...')
     navigator.geolocation.getCurrentPosition(function (position){
         geolocation.removeAttr('disabled').text('send location');
         socket.emit('createLocationMsg',{
             latitude:position.coords.latitude,
             longitude:position.coords.longitude,
         });
     }),function(){
        geolocation.removeAttr('disabled').text('send location');        
         return alert('Unable to fetch the location');
     }
});

socket.on('newLocationMessage', function (message) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');
  
    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
  });
