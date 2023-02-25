const chai = require('chai');
const { featureCheckAttributes } = require('../../Service/feature.logic');
const expect = chai.expect;

describe('featureCheckAttributes', () => {

    it('should return the ON variant', () => {
        const endUserReq = {};
        const experiment = { variantsFF: { ON: { foo: true }, OFF: { foo: false } } };
        const result = featureCheckAttributes(endUserReq, experiment);
        expect(result).to.deep.equal({ ON: { foo: true } });
    });

    it('should return the OFF variant', () => {
        const endUserReq = {};
        const experiment = { variantsFF: { ON: { foo: false }, OFF: { foo: true } } };
        const result = featureCheckAttributes(endUserReq, experiment);
        expect(result).to.deep.equal({ ON: { foo: false } });
    });

});
