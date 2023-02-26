const { getTestsPerMonth,getReqPerAttribute,getActiveExperiments } = require('../../controller/stats.controller');
const ValidationError = require('../../errors/validation.errors');
const NotFoundError = require('../../errors/NotFound.errors');
const ServerError = require('../../errors/internal.errors');
const { expect } = require("chai");
const sinon = require("sinon");
const {getExperimentsAttributesDistribution }= require('../../controller/external.controller');
const ExperimentRepository = require('../../repositories/experiment.repository');

describe('getReqPerAttribute', () => {
    let experimentId;

    before(async () => {
        // create a test experiment to retrieve data from
        const experiment = { testAttributes: ['attr1', 'attr2'], customAttributes: ['attr3'] };
        const newExperiment = await ExperimentRepository.create(experiment);
        const experimentId = newExperiment._id.toString();
    });

    after(async () => {
        // delete the test experiment after the tests complete
        await ExperimentRepository.delete(experimentId);
    });

    it('should return test and custom attributes for a valid experiment ID', async () => {
        const req = { params: { experimentId: experimentId } };
        const res = { status: (code) => ({ send: (data) => {} }) }; // mock response object

        await getReqPerAttribute(req, res);

        expect(res.status).to.have.been.calledWith(200);
        expect(res.body).to.deep.equal({
            testAttributes: ['device', 'chrome'],
            customAttributes: ['attr3']
        });
    });

    it('should throw a MissingPropertyError for an invalid experiment ID', async () => {
        const req = { params: { experimentId: 'invalid-id' } };
        const res = { status: (code) => ({ send: (data) => {} }) }; // mock response object

        try {
            await getReqPerAttribute(req, res);
        } catch (err) {
            expect(err).to.be.an.instanceOf(ValidationError.MissingPropertyError);
            expect(err.message).to.equal('experiment ID');
            expect(res.status).not.to.have.been.called; // response should not have been sent
        }
    });

    it('should throw an EntityNotFound error for a non-existent experiment ID', async () => {
        const req = { params: { experimentId: 'non-existent-id' } };
        const res = { status: (code) => ({ send: (data) => {} }) }; // mock response object

        try {
            await getReqPerAttribute(req, res);
        } catch (err) {
            expect(err).to.be.an.instanceOf(NotFoundError.EntityNotFound);
            expect(err.message).to.equal('experiment (non-existent-id)');
            expect(res.status).not.to.have.been.called; // response should not have been sent
        }
    });
});


describe('getTestsPerMonth', () => {
    it('should throw MissingPropertyError when accountId is missing', async () => {
        const req = { params: {} };
        const res = {};
        try {
            await getTestsPerMonth(req, res);
        } catch (err) {
            expect(err).to.be.an.instanceOf(ValidationError.MissingPropertyError);
            expect(err.message).to.equal(`Property: ${'account ID'} is missing...`);
        }
    });

    // it('should throw NotFoundError when account not found', async () => {
    //     const req = { params: { accountId: 'invalidId' } };
    //     const res = {};
    //     const retrieveStub = sinon.stub(ExperimentRepository, 'getMonthlyCalls').returns(null);
    //     try {
    //         await getTestsPerMonth(req, res);
    //     } catch (err) {
    //         expect(err).to.be.an.instanceOf(NotFoundError.EntityNotFound);
    //         expect(err.message).to.equal(`${'account ID'} not found...`);
    //     } finally {
    //         retrieveStub.restore();
    //     }
    // });


    it('should return monthly Tests for account', async () => {
        const req = { params: { accountId: '12234' } };
        const accountID = req.params.accountId;
        const res = {};
        const expectedResult = { January: 100, February: 200, March: 150 };
        const retrieveStub = sinon.stub(ExperimentRepository, 'getMonthlyCalls').returns(accountID);
        console.log(req);
        try {
            await getTestsPerMonth(req, res);
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({ tests: expectedResult });
        } finally {
            retrieveStub.restore();
        }
    });
});

describe("getActiveExperiments", () => {
    it("should throw an error for invalid month", async () => {
        const req = {
            params: {
                month: 13,
                year: 2022,
            },
        };
        const res = {};

        try {
            await getActiveExperiments(req, res);
        } catch (err) {
            expect(err).to.be.an.instanceOf(ValidationError.InvalidProperty);
            expect(err.message).to.equal(`Property: ${'month'} is not valid`);
        }
    });

    it("should throw an error for future date", async () => {
        const futureDate = new Date(Date.now() + 86400000);
        const month = futureDate.getMonth() + 1;
        const year = futureDate.getFullYear();

        try {
            await getActiveExperiments(month, year);
        } catch (err) {
            expect(err).to.be.an.instanceOf(ServerError.ServerUnableError);
            expect(err.message).to.equal(`Unable to ${'calculate active experiment by date'} due to internal server error...`);
        }
    });

    it("should throw a server error if ExperimentRepository returns undefined", async () => {
        const req = {
            params: {
                month: 2,
                year: 2022,
            },
        };
        const res = {};
        const repositoryStub = sinon.stub(ExperimentRepository, "getActiveExperimentsByDate").resolves(undefined);

        try {
            await getActiveExperiments(req, res);
        } catch (err) {
            expect(err).to.be.an.instanceOf(ServerError.ServerUnableError);
            expect(err.message).to.equal("calculate active experiment by date");
        } finally {
            repositoryStub.restore();
        }
    });

    // it("should return active experiments", async () => {
    //
    //     const id = '1234';
    //     const req = {params: {id}};
    //     const res = {status: sinon.stub().returnsThis(), send: sinon.stub()};
    //     };
    //     const expectedExperiments = [{ id: "exp1" }, { id: "exp2" }];
    //     const repositoryStub = sinon.stub(ExperimentRepository, "getActiveExperimentsByDate").resolves(expectedExperiments);
    //
    //     await getActiveExperiments(req, res);
    //
    //     expect(res.status.calledOnceWithExactly(200)).to.be.true;
    //     expect(res.send.calledOnceWithExactly({ active_experiments: expectedExperiments })).to.be.true;
    //
    //     repositoryStub.restore();
    // });


    describe('getExperimentsAttributesDistribution', function () {
        it('should return attribute distribution if successful', async function () {
            const expectedResult = [
                {_id: {testAttribute: 'color'}, count: 5},
                {_id: {testAttribute: 'size'}, count: 3},
                {_id: {testAttribute: 'text'}, count: 2}
            ];
            const mockReq = {};
            const mockRes = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
            const stub = sinon.stub(ExperimentRepository, 'getExperimentCountsByAttributes').resolves(expectedResult);

            await getExperimentsAttributesDistribution(mockReq, mockRes);

            expect(stub.calledOnce).to.be.true;
            expect(mockRes.status.calledWith(200)).to.be.true;
            expect(mockRes.send.calledWith({attribute_distribution: expectedResult})).to.be.true;

            stub.restore();
        });

        it('should throw a server error if there is an error getting the attribute distribution', async function () {
            const mockReq = {};
            const mockRes = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
            const stub = sinon.stub(ExperimentRepository, 'getExperimentCountsByAttributes').resolves(null);

            try {
                await getExperimentsAttributesDistribution(mockReq, mockRes);
            } catch (error) {
                expect(stub.calledOnce).to.be.true;
                expect(mockRes.status.calledWith(500)).to.be.true;
                expect(mockRes.send.calledWith({error: 'Server unable to calculate experiment attribute distribution'})).to.be.true;
            }

            stub.restore();
        })
    })

});


