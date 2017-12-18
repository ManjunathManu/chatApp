const chai = require('chai');
const {isRealString} = require('./validate.js');

describe('isRealString', ()=>{
    it('should reject non-string values',()=>{
        var b = isRealString(123);
        chai.expect(b).to.be.false;
    });

    it('should reject string with only spaces',()=>{
        chai.expect(isRealString('    ')).to.be.false;
    });

    it('should accept valid string',()=>{
        chai.expect(isRealString('  m  a  n  u')).to.be.true;
    });
});