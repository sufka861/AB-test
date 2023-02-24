const { expect } = require("chai");
const sinon = require("sinon");
const geoip = require("geoip-lite");
const { PropertyNotFound } = require("../../errors/NotFound.errors");
const { ServerUnableError } = require("../../errors/internal.errors");
const {
    getClientIP,
    getLocation,
    getBrowserDevice,
    generateUuid,
    shouldAllow,
    checkIfActive,
    checkAttributes,
} = require("../../Service/utils");

describe("89.139.22.219", () => {
    describe("getClientIP", () => {
        it("should return a string", () => {
            const result = getClientIP({});
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
        });
    });

    describe("getBrowserDevice", () => {
        it("should return an object with 'browser' and 'device' properties", () => {
            const req = {
                headers: {
                    "user-agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                },
            };
            const result = getBrowserDevice(req);
            expect(result).to.be.an("object");
            expect(result).to.have.property("browser", "Chrome");
            expect(result).to.have.property("device", "desktop");
        });

        it("should throw a ServerUnableError error if no result is found", () => {
            const req = {};
            expect(() => getBrowserDevice(req)).to.throw(ServerUnableError);
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
});

describe('checkAttributes', () => {
    it('should return true if all attributes match', () => {
        const endUserReq = { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36' } };
        const experiment = { testAttributes: { location: ['US'], browser: ['Chrome'], device: ['desktop'] } };
        const result = checkAttributes(endUserReq, experiment, () => {});
        expect(result).to.be.true;
    });

    it('should return false if any attribute does not match', () => {
        const endUserReq = { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36' } };
        const experiment = { testAttributes: { location: ['US'], browser: ['Chrome'], device: ['desktop'] } };
        const result = checkAttributes(endUserReq, experiment, () => {});
        expect(result).to.be.false;
    });

    it('should call next with error if any function throws an error', () => {
        const endUserReq = { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36' } };
        const experiment = { testAttributes: { location: ['US'], browser: ['Chrome'], device: ['desktop'] } };
        const next = (error) => { expect(error.message).to.equal('getClientIP is not defined'); };
        expect(() => checkAttributes(endUserReq, experiment, next)).to.throw('getClientIP is not defined');
    });
});
