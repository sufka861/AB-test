const chai = require('chai');
const { ABcheckAttributes, returnByRatio } = require('../../Service/AB.test.logic');
const expect = chai.expect;
const sinon = require('sinon');

describe('ABcheckAttributes', () => {

    it('should return option A', () => {
        const endUserReq = {};
        const experiment = { variantsAB: { A: { foo: 'bar' }, B: { foo: 'baz' }, C: { foo: 'qux' } } };
        const result = ABcheckAttributes(endUserReq, experiment);
        expect(result).to.deep.equal({ A: { foo: 'bar' } });
    });

    it('should return option B', () => {
        const endUserReq = {};
        const experiment = { variantsAB: { A: { foo: 'bar' }, B: { foo: 'baz' }, C: { foo: 'qux' } } };
        sinon.stub(Math, 'random').return(0.6);
        const result = ABcheckAttributes(endUserReq, experiment);
        expect(result).to.deep.equal({ B: { foo: 'baz' } });
        Math.random.restore();
    });

});

describe('returnByRatio', () => {

    it('should return option A', () => {
        sinon.stub(Math, 'random').return(0.4);
        const result = returnByRatio({ A: { foo: 'bar' } }, { B: { foo: 'baz' } });
        expect(result).to.deep.equal({ A: { foo: 'bar' } });
        Math.random.restore();
    });

    it('should return option B', () => {
        sinon.stub(Math, 'random').return(0.6);
        const result = returnByRatio({ A: { foo: 'bar' } }, { B: { foo: 'baz' } });
        expect(result).to.deep.equal({ B: { foo: 'baz' } });
        Math.random.restore();
    });

});
