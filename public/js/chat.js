var socket = io();

function scrollToButtom() {
    document.getElementById('msgList').scrollTop = document.getElementById('msgList').scrollHeight;

}

socket.on('connect', function () {
    console.log('connected to server');
    var params = jQuery.deparam(window.location.search);
    $("#roomName").text(params.room);
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {

        }
    })
});

socket.on('privateChatInvitation', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#invitation-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToButtom();
})

socket.on('updateUsersList', function (users) {
    var ul = jQuery('<ul id="usersList"></ul>');

    users.forEach((user) => {
        ul.append(jQuery('<li></li>').text(user));
    })
    jQuery('#users').html(ul);
});

socket.on('newMsg', function (msg) {
    console.log('New msg arrived', msg);
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        from: msg.from,
        text: msg.text,
        createdAt: formattedTime
    })
    jQuery('#messages').append(html);
    scrollToButtom();
}, function (ack) {
    console.log('got it', ack);
});

socket.on('disconnect', function () {
    console.log('disconnected from server');
});

$("#message-form").keypress(function (e) {
    var key = e.which;
    if (key == 13) {
        socket.emit('createMsg', {
            text: jQuery('[name=message]').val()
        }, function () {
            jQuery('[name=message]').val('');
        });
    }
});

$("#sendBtn").on("click", function () {
    socket.emit('createMsg', {
        text: jQuery('[name=message]').val()
    }, function () {
        jQuery('[name=message]').val('');
    });
})

var geolocation = jQuery("#send-location");

geolocation.on('click', function () {

    if (!navigator.geolocation)
        return alert('Browser does not support geolocaton');

    geolocation.attr('disabled', 'disabled').text('Sending location...')
    navigator.geolocation.getCurrentPosition(function (position) {
            geolocation.removeAttr('disabled').text('send location');
            socket.emit('createLocationMsg', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        }),
        function () {
            geolocation.removeAttr('disabled').text('send location');
            return alert('Unable to fetch the location');
        }
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My current location</a>');

    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
    jQuery('#messages').append(html);
    scrollToButtom();
});

jQuery("#leaveRoom").click(function (e) {
    window.location.href = "/"
});

$("#users").on('click', 'li', function (e) {
    var params = jQuery.deparam(window.location.search);
    if ($("#users").children() && this.innerText !== params.name) {
        let to = this.innerText;
        console.log(to)
        window.open(`/privateChat.html?from=${params.name}&to=${to}`);
    }

})