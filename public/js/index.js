let socket = io();
$(document).ready(function(){
 let roomChat = true;

 $("#rooms").on('click', 'li', function(event){
     event.preventDefault();
     console.log(this.innerText);
     jQuery('[name=room]').val(this.innerText);
    //  $('#chat-login').submit();
    roomChat = true;
     $('#joinBtn').click();
 });

 $('#chat_login').submit(function(){
     if(roomChat){
        $('#chat_login').attr('action','/../chat.html');
     }else{
        $('#chat_login').attr('action','/../privateChat.html');
    }
 })

 $('#users').on('click', 'li', function(event){
     event.preventDefault();
     console.log(this.innerText);
     jQuery('[name=room]').val(this.innerText);
    //  $("#user2").attr("name","user2");
     roomChat = false;
     $("#chat_login").submit();
 })
});

socket.on('connect',function (){
    console.log('connected to server');
    //var params = jQuery.deparam(window.location.search);
    socket.emit('login', function(err){
        if(err){
        alert(err);
        window.location.href= '/';
        }else{

        }
    })
});

socket.on('updateUsersList', function(users){
    var ol = jQuery('<ol class="list-group" id="users"></ol>');

    users.forEach((user)=>{
        ol.append(jQuery('<li class="list-group-item list-group-item-info" style="cursor:pointer">')
        .append(jQuery('<span ></span>').text(user)));
    })
    jQuery('#users').html(ol);
});

socket.on('updateRoomsList', function(rooms){
    var ol = jQuery('<ol class="list-group" id="rooms"></ol>');

    rooms.forEach((room)=>{
        ol.append(jQuery('<li class="list-group-item list-group-item-success" style="cursor:pointer">')
        .append(jQuery('<span ></span>').text(room)));
    })
    jQuery('#rooms').html(ol);
});
