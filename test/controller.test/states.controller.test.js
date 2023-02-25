const { expect } = require('chai');
const sinon = require('sinon');
const { statsRouter } = require('../../router/stats.router');
const {getStatistics} = require ('../../controller/stats.controller');
const { describe, it } = require('mocha');
const ExperimentRepository = require('../../repositories/experiment.repository');


describe('getStatistics', () => {
    it('should return statistics for an experiment of type "a-b"', async () => {
        const experimentId = '63b9ec3ee5b633ebbbf1250b';
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
            params: { experimentId },
        };
        const res = {
            status: sinon.spy(),
            send: sinon.spy(),
        };
        sinon.stub(ExperimentRepository, 'retrieve').returns(experiment);

        const result = getStatistics(req, res);

      //  expect(result.status.calledOnce).to.be.true;
        expect(result.status.args[0][0]).to.equal(200);
        expect(result.send.calledOnce).to.be.true;
        expect(result.send.args[0][0]).to.deep.equal({
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

