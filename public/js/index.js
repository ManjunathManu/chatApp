let socket = io();
$(document).ready(function(){

 $("#rooms").on('click', 'li', function(){
     console.log(this.innerText);
     jQuery('[name=room]').val(this.innerText);
     $('#joinBtn').click();
 });

 $('#users').on('click', 'li', function(event){
     event.preventDefault();
     console.log(this.innerText);
    //  $('#privateChatBtn').click({"to":this.innerText, "from":$('#user1').val()},()=>{});
    //  socket.emit('privateChat',{"to":this.innerText, "from":$('#user1').val()}, () =>{});
    let receiver = jQuery('[name=room]').val(this.innerText);
    socket.emit('privateChat',receiver,()=>{})
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
    // console.log(users);
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
