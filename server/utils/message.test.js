const chai = require('chai');
const {generateMessage} = require('./message.js');

describe('generate new message', ()=>{
    it('should generate a new message',()=>{
        var from = 'abc';
        var text = 'measssvd';
        var msg = generateMessage(from, text);

        chai.expect(msg.text).to.be.equal(text);
        chai.expect(msg.from).to.be.equal(from);
        
        chai.expect(msg).to.have.all.keys('from', 'text', 'createdAt');
    
    })
})