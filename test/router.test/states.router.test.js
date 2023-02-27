const chai = require("chai");
const { expect } = chai;
const { describe, it } = require('mocha');
const sinon = require('sinon');
const ExperimentRepository = require('../../repositories/experiment.repository');
const {getExperimentsAttributesDistribution} = require('../../controller/stats.controller');


describe('getExperimentsAttributesDistribution', () => {
    it('should return an object with attribute distribution if successful', async () => {
        const experimentCounts = [
            { location: 'USA', browser: 'Chrome', device: 'Desktop', count: 5 },
            { location: 'USA', browser: 'Safari', device: 'Mobile', count: 3 },
            { location: 'Canada', browser: 'Firefox', device: 'Desktop', count: 2 },
        ];
        sinon.stub(ExperimentRepository, 'getExperimentCountsByAttributes').resolves(experimentCounts);

        const req = {};
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub(),
        };

        await getExperimentsAttributesDistribution(req, res);
        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.send.calledOnceWith({
            attribute_distribution: experimentCounts,
        })).to.be.true;
    });

    it('should throw an error if ExperimentRepository.getExperimentCountsByAttributes returns false', async () => {
        sinon.stub(ExperimentRepository, 'getExperimentCountsByAttributes').resolves(null);

        const req = {};
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub(),
        };

        try {
            await getExperimentsAttributesDistribution(req, res);
        } catch (error) {
            expect(error.message).to.equal('Unable to calculate experiment attribute distribution  due to internal server error...');
            expect(res.status.calledOnceWith(500)).to.be.true;
            expect(res.send.calledOnceWith({ error: 'Unable to calculate experiment attribute distribution  due to internal server error...'})).to.be.true;
        }
    });
});
