const chai = require('chai');
const { featureCheckAttributes } = require('../Service/feature.logic');
const expect = chai.expect;

describe('featureCheckAttributes', () => {

    it('should return the ON variant', () => {
        const endUserReq = {};
        const experiment = { variantsFF: { ON: { foo: 'bar' }, OFF: { foo: 'baz' } } };
        const result = featureCheckAttributes(endUserReq, experiment);
        expect(result).to.deep.equal({ ON: { foo: 'bar' } });
    });

});
