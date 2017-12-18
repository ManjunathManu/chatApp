class User{
    constructor (){
        this.users=[];
    }
    addUser(id, name, room){
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }
    getUser(id){
        return this.users.filter((user)=> user.id === id)[0];
       

    }
    removeUser(id){
        var user = this.getUser(id);
        if(user)
            this.users = this.users.filter((user)=>user.id !== id);
        return user;
    }
    getAllUsers(room){
        var user = this.users.filter((user)=> user.room === room);
        var names= user.map((user)=> user.name);
        return names;
    }
}
module.exports ={User};