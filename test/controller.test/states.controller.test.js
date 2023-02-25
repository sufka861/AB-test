const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const ValidationError = require("../../errors/validation.errors");
const NotFoundError = require("../../errors/NotFound.errors");
const ServerError = require("../../errors/internal.errors");
const ExperimentRepository = require("../../repositories/experiment.repository");
const UserRepository = require("../../repositories/user.repository");
const { getStatistics, getUsersStats } = require("../../controller/stats.controller");

describe("Stats controller - getStatistics", () => {
    const experimentId = "6023f3d345281d5278dc6680";
    const experiment = {
        _id: experimentId,
        type: "a-b",
        variantSuccessCount: {
            A: 100,
            B: 200,
            C: 300,
        },
        callCount: 600,
    };

    beforeEach(() => {
        sinon.stub(ExperimentRepository, "retrieve").resolves(experiment);
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should return correct statistics for A/B test", async () => {
        const req = {params: {id: experimentId}};
        const res = {
            status: sinon.spy(),
            send: sinon.spy(),
        };

        await getStatistics(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.send.calledWith({
            A: "16.67",
            B: "33.33",
            C: "50.00",
        })).to.be.true;
    });

    it("should return correct statistics for feature flag test", async () => {
        experiment.type = "f-f";
        experiment.variantSuccessCount = {
            ON: 400,
            OFF: 200,
        };

        const req = {params: {id: experimentId}};
        const res = {
            status: sinon.spy(),
            send: sinon.spy(),
        };

        await getStatistics(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.send.calledWith({
            ON: "66.67",
            OFF: "33.33",
        })).to.be.true;
    });

    it("should throw a validation error when experiment ID is invalid", async () => {
        const req = {params: {id: "invalid-id"}};
        const res = {
            status: sinon.spy(),
            send: sinon.spy(),
        };

        try {
            await getStatistics(req, res);
        } catch (error) {
            expect(error).to.be.instanceOf(ValidationError.MissingPropertyError);
            expect(error.message).to.equal("experiment ID is missing");
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledWith({error: "experiment ID is missing"})).to.be.true;
        }
    });

    it("should throw a not found error when experiment does not exist", async () => {
        ExperimentRepository.retrieve.resolves(null);

        const req = {params: {id: experimentId}};
        const res = {
            status: sinon.spy(),
            send: sinon.spy(),
        };

        try {
            await getStatistics(req, res);
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError.EntityNotFound);
            expect(error.message).to.equal(`experiment (${experimentId}) not found`);
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.send.calledWith({error: `experiment (${experimentId}) not found`})).to.be.true;
        }
    });

    it("should throw a server error when experiment call count is missing", async () => {
        experiment.callCount = null;

        // const req = { params: { id: experimentId
        //         beforeEach(() => {
        //     retrieveStub = sinon.stub(ExperimentRepository, "retrieve");
        // });

        afterEach(() => {
            retrieveStub.restore();
        });

        it("should return statistics when experiment is found", async () => {
            const experiment = {
                _id: experimentID,
                type: "a-b",
                callCount: 10,
                variantSuccessCount: {A: 4, B: 6, C: 0},
            };
            retrieveStub.resolves(experiment);

            const expectedResult = {
                A: "40.00",
                B: "60.00",
                C: "0.00",
            };

            const req = {params: {id: experimentID}};
            const res = {
                status: sinon.spy(),
                send: sinon.spy(),
            };

            await getStatistics(req, res);

            expect(retrieveStub.calledOnceWithExactly(experimentID)).to.be.true;
            expect(res.status.calledOnceWithExactly(200)).to.be.true;
            expect(res.send.calledOnceWithExactly(expectedResult)).to.be.true;
        });

        it("should throw ValidationError when experiment id is invalid", async () => {
            const req = {params: {id: "invalidId"}};
            const res = {
                status: sinon.spy(),
                send: sinon.spy(),
            };

            try {
                await getStatistics(req, res);
            } catch (error) {
                expect(error).to.be.an.instanceOf(ValidationError.MissingPropertyError);
                expect(error.message).to.equal("experiment ID is required");
                expect(retrieveStub.notCalled).to.be.true;
                expect(res.status.notCalled).to.be.true;
                expect(res.send.notCalled).to.be.true;
            }
        });

        it("should throw NotFoundError when experiment is not found", async () => {
            retrieveStub.resolves(null);

            const req = {params: {id: experimentID}};
            const res = {
                status: sinon.spy(),
                send: sinon.spy(),
            };

            try {
                await getStatistics(req, res);
            } catch (error) {
                expect(error).to.be.an.instanceOf(NotFoundError.EntityNotFound);
                expect(error.message).to.equal(`experiment (${experimentID}) not found`);
                expect(retrieveStub.calledOnceWithExactly(experimentID)).to.be.true;
                expect(res.status.notCalled).to.be.true;
                expect(res.send.notCalled).to.be.true;
            }
        });

        it("should throw ServerError when experiment call count is missing", async () => {
            const experiment = {
                _id: experimentID,
                type: "a-b",
                callCount: null,
                variantSuccessCount: {A: 4, B: 6, C: 0},
            };
            retrieveStub.resolves(experiment);

            const req = {params: {id: experimentID}};
            const res = {
                status: sinon.spy(),
                send: sinon.spy(),
            };

            // try {
            //     await getStatistics(req, res);
            // } catch (error
            //

            const expectedResponse = {
                A: "40.00",
                B: "30.00",
                C: "10.00",
            };

            // const req = { params: { id: experimentID } };
            // const res = {
            //     status: sinon.stub().returnsThis(),
            //     send: sinon.stub(),
            // };

            await ExperimentController.getStatistics(req, res);

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, expectedResponse);

            ExperimentRepository.retrieve.restore();
        });

        it("should return success percentages for ON and OFF variants when the experiment type is F-F", async () => {
            const experimentID = "60e81de7734d1d62a77a7a1f";
            const experiment = {
                _id: experimentID,
                type: "f-f",
                callCount: 20,
                variantSuccessCount: {ON: 8, OFF: 12},
            };
            sinon.stub(ExperimentRepository, "retrieve").resolves(experiment);

            const expectedResponse = {
                ON: "40.00",
                OFF: "60.00",
            };

            const req = {params: {id: experimentID}};
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub(),
            };

            await ExperimentController.getStatistics(req, res);

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, expectedResponse);

            ExperimentRepository.retrieve.restore();
        });

        it("should throw a validation error when experimentID is not a valid ObjectId", async () => {
            const experimentID = "invalidId";
            sinon.stub(ExperimentRepository, "retrieve").resolves(null);

            const req = {params: {id: experimentID}};
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub(),
            };

            await assert.rejects(
                async () => ExperimentController.getStatistics(req, res),
                ValidationError.MissingPropertyError
            );

            sinon.assert.notCalled(res.status);
            sinon.assert.notCalled(res.send);

            ExperimentRepository.retrieve.restore();
        });

        it("should throw an entity not found error when the experiment does not exist", async () => {
            const experimentID = "60e81de7734d1d62a77a7a1f";
            sinon.stub(ExperimentRepository, "retrieve").resolves(null);

            const req = {params: {id: experimentID}};
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub(),
            };

            await assert.rejects(
                async () => ExperimentController.getStatistics(req, res),
                NotFoundError.EntityNotFound
            );

            sinon.assert.notCalled(res.status);
            sinon.assert.notCalled(res.send);

            ExperimentRepository.retrieve.restore();
        });

    })
});
