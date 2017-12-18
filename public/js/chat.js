var socket = io();

function scrollToButtom (){
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    var scrollHeight = messages.prop('scrollHeight');
    var scrollTop = messages.prop('scrollTop');
    var clientHeight = messages.prop('clientHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight)
    }
}

socket.on('connect',function (){
    console.log('connected to server');
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function(err){
        if(err){
        alert(err);
        window.location.href= '/';
        
        }else{

        }
    })
    // socket.emit('createMsg',{"to":"vp","text":"how u doing?"});
});

socket.on('updateUsersList', function(users){
    // console.log(users);
    var ol = jQuery('<ol></ol>');

    users.forEach((user)=>{
        ol.append(jQuery('<li></li>').text(user));
    })
    jQuery('#users').html(ol);
})

socket.on('newMsg',function (msg){
    console.log('New msg arrived',msg);
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        from : msg.from,
        text : msg.text,
        createdAt : formattedTime
    })
    // var li = jQuery('<li></li>');
    // li.text(`${msg.from} ${formattedTime}:${msg.text}`);
    jQuery('#messages').append(html);
    scrollToButtom();
},function(ack){
    console.log('got it',ack);
});

socket.on('disconnect', function (){
    console.log('disconnected from server');
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    socket.emit('createMsg',{text:jQuery('[name=message]').val()}, function(){
        jQuery('[name=message]').text(' ');
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
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template ,{
        from : message.from,
        url : message.url,
        createdAt : formattedTime
    });
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My current location</a>');
  
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
    jQuery('#messages').append(html);
    scrollToButtom();
  });
