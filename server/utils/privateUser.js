class privateUser{
    constructor (){
        this.users=[];
    }
    addUser(id, from, to){
        var user = {id, from, to};
        this.users.push(user);
        return user;
    }
    getUser(id){
        return this.users.filter((user)=> user.id === id)[0];
    }

    getUserId(from, to){
        return this.users.filter((user)=> user.from === from && user.to === to)[0];
    }

    getUserPrivateId(from, to){
        return this.users.filter((user)=>user.from === to && user.to === from)[0].id;
    }

    removeUser(id){
        var user = this.getUser(id);
        if(user)
            this.users = this.users.filter((user)=>user.id !== id);
        return user;
    }
}
module.exports ={privateUser};