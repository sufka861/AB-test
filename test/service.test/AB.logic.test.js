const chai = require('chai');
const { ABcheckAttributes, returnByRatio } = require('../../Service/AB.test.logic');
const expect = chai.expect;
const sinon = require('sinon');
describe("ABcheckAttributes", () => {
    it("should return an object with A and B properties", () => {
        const experiment = {
            variantsAB: {
                A: "50",
                B: "50",
                C: "0",
            },
        };
        const result = ABcheckAttributes(experiment);
        expect(result).to.have.property('A: A, tested: true');
        expect(result).to.have.property('B: 50, tested: true');
        expect(result).to.not.have.property("C");
    });

    it("should return an object with tested properties set to true", () => {
        const experiment = {
            variantsAB: {
                A: 50,
                B: 50,
                C: 0,
            },
        };
    const result = ABcheckAttributes(experiment);
    expect(result).to.have.property('true');
    expect(result).to.have.property( 'false');
});

it("should return the correct ratio of A to B", () => {
    const experiment = {
        variantsAB: {
            A: 75,
            B: 25,
            C: 0,
        },
    };
    const result = ABcheckAttributes(experiment);
    expect(result.A / result.B).to.be.closeTo(3, 0.1);
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
