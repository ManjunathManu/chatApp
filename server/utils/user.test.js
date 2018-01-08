const chai = require('chai');
const {User} = require('./user');

describe('User class and methods',()=>{
    var users;
    beforeEach(()=>{
        users= new User();
        
           users.users=[{
                id:1,
                name:'manu',
                room:'nodejs'
            },{
                id:2,
                name:'manju',
                room:'PHP'
            },{
                id:3,
                name:'manjunath',
                room:'nodejs'
            }];
    });
   
    it('should add a new user',()=>{
        var users= new User();
        var user = {id:'123', name:'manju', room:'techjini'};
       var resUsr= users.addUser(user.id, user.name, user.room);
        //chai.expect(users.users).to.have.all.keys('id', 'name', 'room');
        chai.expect(users.users).to.eql([user]);
    });

    it('should get a user with id',()=>{
        var user = users.getUser(2);
        chai.expect(user.name).to.eql('manju');
    });

    it('should remove a user', ()=>{
        var user = users.removeUser(2);
        chai.expect(user.id).to.equal(2);
        chai.expect(users.users.length).to.equal(2);
    });

    it('return all the users in the room',()=>{
        var names=users.getAllUsersInRoom('nodejs');
        var names2 = users.getAllUsersInRoom('PHP');
        chai.expect(names).to.eql(['manu','manjunath']);
        chai.expect(names2).to.eql(['manju']);
    });

    it('return all the rooms',()=>{
       let rooms = users.getAllRooms();
        chai.expect(rooms).to.eql(['nodejs','PHP']);
    });

    it('return all users', ()=>{
        let allUsers = users.getAllUsers();
        chai.expect(allUsers).to.eql(['manu', 'manju', 'manjunath']);
    })

    it('return user id', ()=>{
        let userId = users.getUserId('manju');
        chai.expect(userId).to.eql(2)
        })
})