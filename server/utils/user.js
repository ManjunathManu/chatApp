class User{
    constructor (){
        this.users=[];
    }
    addUser(id,privateId, name, room){
        var user = {id,privateId, name, room};
        this.users.push(user);
        return user;
    }
    getUser(id){
        return this.users.filter((user)=> user.id === id)[0];
    }

    getUserId(name){
        return this.users.filter((user)=>user.name === name)[0].id;
    }
    getUserPrivateId(name){
        return this.users.filter((user)=>user.name === name)[0].privateId;
    }
    removeUser(id){
        var user = this.getUser(id);
        if(user)
            this.users = this.users.filter((user)=>user.id !== id);
        return user;
    }
    getAllUsersInRoom(room){
        var user = this.users.filter((user)=> user.room === room);
        var names= user.map((user)=> user.name);
        return names;
    }
    getAllRooms(){
        var rooms = this.users.map((user)=>user.room);
        var roomsFiltered = rooms.filter((room, pos)=>{
            return rooms.indexOf(room) == pos;
        })
        return roomsFiltered;
    }
    getAllUsers(){
        var users = this.users.map((user)=> user.name);
        var usersFiltered = users.filter((user, pos)=>{
            return users.indexOf(user) == pos;
        })
        return usersFiltered;
    }
}
module.exports ={User};