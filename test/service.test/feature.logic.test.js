const chai = require('chai');
const { featureCheckAttributes } = require('../../Service/feature.logic');
const expect = chai.expect;

describe('featureCheckAttributes', () => {

    it('should return the ON variant', () => {
        const endUserReq = {};
        const experiment = { variantsFF: { ON:  true , OFF:  false }}  ;
        const result = featureCheckAttributes(endUserReq, experiment);
        expect(result).to.deep.equal({ ON:  true } );
    });

    it('should return the OFF variant', () => {
        const endUserReq = {};
        const experiment = { variantsFF: { ON:  false }, OFF:  true }  ;
        const result = featureCheckAttributes(endUserReq, experiment);
        expect(result).to.deep.equal({ ON:  false  });
    });

});
