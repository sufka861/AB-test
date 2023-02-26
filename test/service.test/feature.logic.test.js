const chai = require('chai');
const { featureCheckAttributes } = require('../../Service/feature.logic');
const expect = chai.expect;

describe('featureCheckAttributes', () => {

    it('should return the ON variant', () => {
        const endUserReq = {};
        const experiment = { variantsFF: { ON:  true , OFF:  false ,tested: true }}  ;
        const result = featureCheckAttributes(endUserReq, experiment);
        expect(result).to.deep.equal({ ON:  true ,tested:true} );
    });

    it('should return the OFF variant', () => {
        const endUserReq = {};
        const experiment = { variantsFF: { ON:  false }, OFF:  true ,tested: true}  ;
        const result = featureCheckAttributes(endUserReq, experiment);
        expect(result).to.deep.equal({ ON:  false ,tested: true });
    });

});
