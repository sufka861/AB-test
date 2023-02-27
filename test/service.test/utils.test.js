const { expect } = require("chai");
const sinon = require("sinon");
const geoip = require("geoip-lite");
const parser = require("ua-parser-js");
const { v4: uuidv4, validate: uuidValidator } = require("uuid");
const { PropertyNotFound } = require("../../errors/NotFound.errors");
const { ServerUnableError } = require("../../errors/internal.errors");
const {
    generateUuid,
    shouldAllow,
    checkIfActive,
    checkAttributes,
} = require("../../Service/utils");

describe("176.12.223.44", () => {
    describe("getClientIP", () => {
        it("should return a string", () => {
            const result = getClientIP({});
            console.log(result);
            expect(result).to.be.a("string");
        });
    });

    describe("getLocation", () => {
        it("should throw a PropertyNotFound error if no request is provided", () => {
            expect(() => getLocation()).to.throw(PropertyNotFound);
        });

        it("should throw a ServerUnableError error if geoip.lookup returns null", () => {
            const req = "invalid-ip";
            sinon.stub(geoip, "lookup").returns(null);
            expect(() => getLocation(req)).to.throw(ServerUnableError);
            geoip.lookup.restore();
        });

        it("should return an object if geoip.lookup returns a result", () => {
            const req = "176.12.223.44";
            sinon.stub(geoip, "lookup").returns({country: "US"});
            const result = getLocation(req);
            expect(result).to.be.an("object");
            expect(result).to.have.property("country", "US");
            geoip.lookup.restore();
            console.log(result);
        });
    });

    describe("generateUuid", () => {
        it("should return a valid UUID", () => {
            const result = generateUuid();
            expect(uuidValidator(result)).to.be.true;
        });
    });

    describe("shouldAllow", () => {
        it("should return true if ratio is greater than or equal to a random number between 0 and 1", () => {
            expect(shouldAllow(1)).to.be.true;
            expect(shouldAllow(0.5)).to.be.oneOf([true, false]);
            expect(shouldAllow(0)).to.be.false;
        });
    })
});

describe('checkIfActive', () => {
    it('should return true if experiment status is active', () => {
        const experiment = { status: 'active' };
        const result = checkIfActive(experiment);
        expect(result).to.be.true;
    });

    it('should return false if experiment status is not active', () => {
        const experiment = { status: 'paused' };
        const result = checkIfActive(experiment);
        expect(result).to.be.false;
    });

    it('should return false if experiment status is not active', () => {
        const experiment = { status: 'planned' };
        const result = checkIfActive(experiment);
        expect(result).to.be.false;
    });

    it('should return false if experiment status is not active', () => {
        const experiment = { status: 'terminated' };
        const result = checkIfActive(experiment);
        expect(result).to.be.false;
    });

    it('should return false if experiment status is not active', () => {
        const experiment = { status: 'ended' };
        const result = checkIfActive(experiment);
        expect(result).to.be.false;
    });
});


describe('checkAttributes', () => {
    it('should return true when all attributes match', () => {
        const testAttributes = {
            location: 'US',
            browser: 'Chrome',
            device: 'desktop',
        };
        const customAttributes = {
            age: '25',
            gender: 'male',
        };
        const experiment = {
            testAttributes: {
                location: [{ value: 'US' }],
                browser: [{ value: 'Chrome' }],
                device: [{ value: 'desktop' }],
            },
            customAttributes: new Map([
                ['age', [{ value: '25' }]],
                ['gender', [{ value: 'male' }]],
            ]),
            experimentId: 123,
        };
        const result = checkAttributes(testAttributes, customAttributes, experiment, () => {});
        expect(result).to.be.true;
    });

    it('should return false when a default attribute does not match', () => {
        const testAttributes = {
            location: 'US',
            browser: 'Safari',
            device: 'desktop',
        };
        const experiment = {
            testAttributes: {
                location: [{ value: 'US' }],
                browser: [{ value: 'Chrome' }],
                device: [{ value: 'desktop' }],
            },
            customAttributes: new Map(),
            experimentId: 123,
        };
        const result = checkAttributes(testAttributes, null, experiment, () => {});
        expect(result).to.be.false;
    });

    it('should throw an error when incAttributeReqCount fails', () => {
        const testAttributes = {
            location: 'US',
            browser: 'Chrome',
            device: 'desktop',
        };
        const experiment = {
            testAttributes: {
                location: [{ value: 'US' }],
                browser: [{ value: 'Chrome' }],
                device: [{ value: 'desktop' }],
            },
            customAttributes: new Map(),
            experimentId: '123',
        };
        const next = (error) => {
            expect(error.message).to.equal(`Unable to ${'attReqCountResult'} due to internal server error...`);
        };
        const result = checkAttributes(testAttributes, null, experiment, next);
        expect(result).to.be.undefined;
    });
});
