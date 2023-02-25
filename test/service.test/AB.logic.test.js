const chai = require('chai');
const { ABcheckAttributes, returnByRatio } = require('../../Service/AB.test.logic');
const expect = chai.expect;
const sinon = require('sinon');

describe('ABcheckAttributes', () => {

    it('should return option A', () => {
        const endUserReq = {};
        const experiment = { variantsAB: { A: { foo: 'red' }, B: { foo: 'blue' }, C: { foo: 'null' } } };
        const result = ABcheckAttributes(endUserReq, experiment);
        expect(result).to.deep.equal({ A: { foo: 'red' } });
        console.log("should return option A");
    });

    it('should return option B', () => {
        const endUserReq = {};
        const experiment = { variantsAB: { A: { foo: 'red' }, B: { foo: 'blue' }, C: { foo: 'null' } } };
        const stub = sinon.stub(Math, 'random').returns(0.6);
        const result = ABcheckAttributes(endUserReq, experiment);
        expect(result).to.deep.equal({ B: { foo: 'blue' } });
        stub.restore();
        console.log("should return option B");
    });

});


describe('returnByRatio', function() {
    it('should return either optionA or optionB', function() {
        const result = returnByRatio('red', 'blue');
        expect(result).to.satisfy(val => val === 'red' || val === 'blue');
    });

    it('should return optionA with a probability of 0.5', function() {
        const optionA = 'red';
        const optionB = 'blue';
        const results = Array(1000).fill().map(() => returnByRatio(optionA, optionB));
        const countA = results.filter(val => val === optionA).length;
        console.log('countA= '+ {countA});
        const countB = results.filter(val => val === optionB).length;
        console.log('countB= '+ {countB});
        const ratio = countA / (countA + countB);
        expect(ratio).to.be.closeTo(0.5, 0.1);
        console.log(ratio);
    });
});
