const moment = require('moment');
let env = process.env.NODE_ENV || "development";
if(env === 'development'){
    url = 'http://localhost:3000/'
}else{
    url = 'https://rocky-mountain-95524.herokuapp.com/'
}
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
        url: `${url}privateChat.html?from=${to}&to=${from}`,
        createdAt:moment().valueOf()
    }
}
module.exports = {generateMessage,generateLocationMessage,generatePrivateInvitation};