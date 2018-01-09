const moment = require('moment');

var generateMessage = (from, text)=>{
return {
    from,
    text,
    createdAt : moment().valueOf()
     }
};

var generateLocationMessage = (from, lat, lng)=>{
    return {
        from,
        url: `https://www.google.com/maps?q=${lat},${lng}`,
        createdAt:moment().valueOf()
    }
}

let generatePrivateInvitation = (from,to)=>{
    return {
        from,
        url: `http://localhost:3000/privateChat.html?name=${to}&user2=${from}`,
        createdAt:moment().valueOf()
    }
}
module.exports = {generateMessage,generateLocationMessage,generatePrivateInvitation};