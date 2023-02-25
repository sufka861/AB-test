const chai = require("chai");
const { expect } = chai;
const { describe, it } = require('mocha');
const sinon = require('sinon');
const ExperimentRepository = require('../../repositories/experiment.repository');
const {getStatistics} = require('../../controller/stats.controller');


describe('getStatistics', () => {
    it('should return statistics for an experiment of type "a-b"', async () => {
        const experimentId = '123';
        const callCount = 100;
        const variantSuccessCount = {
            A: 30,
            B: 50,
            C: 20,
        };
        const experiment = {
            id: experimentId,
            type: 'a-b',
            callCount: callCount,
            variantSuccessCount: variantSuccessCount,
        };

        const req = {
            params: { id: experimentId },
        };
        const res = {
            status: sinon.spy(),
            send: sinon.spy(),
        };
        sinon.stub(ExperimentRepository, 'retrieve').returns(experiment);

        await getStatistics(req, res);

        expect(res.status.calledOnce).to.be.true;
        expect(res.status.args[0][0]).to.equal(200);
        expect(res.send.calledOnce).to.be.true;
        expect(res.send.args[0][0]).to.deep.equal({
            A: 30,
            B: 50,
            C: 20,
        });

        ExperimentRepository.retrieve.restore();
    });

    it('should throw an error if experiment is not found', async () => {
        const experimentId = '123';

        const req = {
            params: { id: experimentId },
        };
        const res = {
            status: sinon.spy(),
            send: sinon.spy(),
        };
        sinon.stub(ExperimentRepository, 'retrieve').returns(null);

        let error = null;
        try {
            await getStatistics(req, res);
        } catch (e) {
            error = e;
        }

        expect(error).to.not.be.null;
        expect(error.name).to.equal('EntityNotFound');
        expect(error.message).to.equal(`experiment (${experimentId}) not found`);

        ExperimentRepository.retrieve.restore();
    });

    it('should throw an error if experiment type is invalid', async () => {
        const experimentId = '123';
        const experiment = {
            id: experimentId,
            type: 'invalid-type',
        };

        const req = {
            params: { id: experimentId },
        };
        const res = {
            status: sinon.spy(),
            send: sinon.spy(),
        };
        sinon.stub(ExperimentRepository, 'retrieve').returns(experiment);

        let error = null;
        try {
            await getStatistics(req, res);
        } catch (e) {
            error = e;
        }

        expect(error).to.not.be.null;
        expect(error.name).to.equal('InvalidProperty');
        expect(error.message).to.equal(
            `experiment type in experiment (${experimentId}) is invalid`
        );

        ExperimentRepository.retrieve.restore();
    });

});

