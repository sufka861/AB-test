const expect = require('chai').expect;
const sinon = require('sinon');
const { PropertyNotFound, BodyNotSent } = require("../../errors/NotFound.errors");
const { ServerUnableError } = require("../../errors/internal.errors");
const ExperimentRepository = require ('../../repositories/experiment.repository');
const {getAllExperiments,getExperimentById,getExperimentsByAccountId,getExperimentsAB} = require ("../../controller/experiment.controller");


describe('getAllExperiments', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                this.data = data;
                return this;
            }
        };
    });

    it('should return all experiments and send the result as response with a 200 status code', async () => {
        const experiments = [{ id: '5505' }, { id: '78796' }];
        const findStub = sinon.stub(ExperimentRepository, 'find').resolves(experiments);

        await getAllExperiments(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data).to.deep.equal(experiments);
        expect(findStub).to.be.an;

        findStub.restore();
    });

    it('should throw ServerUnableError if ExperimentRepository.find() returns falsy value', async () => {
        const findStub = sinon.stub(ExperimentRepository, 'find').resolves(null);

        try {
            await getAllExperiments(req, res);
            expect.fail('Should have thrown ServerUnableError');
        } catch (error) {
            expect(error).to.be.instanceOf(ServerUnableError);
            expect(error.message).to.equal(`Unable to ${'getAllExperiments'} due to internal server error...`);
            expect(res.statusCode).to.be.undefined;
            expect(res.data).to.be.undefined;
        }

        findStub.restore();
    });

    describe('getExperimentById', () => {
        let req, res;

        beforeEach(() => {
            req = {
                params: {
                    experimentId: 'exp-1'
                }
            };
            res = {
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.data = data;
                    return this;
                }
            };
        });

        it('should return the experiment and send the result as response with a 200 status code', async () => {
            const experiment = { id: '1234' };
            const retrieveStub = sinon.stub(ExperimentRepository, 'retrieve').resolves(experiment);

            await getExperimentById(req, res);

            expect(res.statusCode).to.equal(200);
            expect(res.data).to.deep.equal(experiment);
            expect(retrieveStub).to.be.be.an(req.params.experimentId);

            retrieveStub.restore();
        });

        it('should throw PropertyNotFound error if experimentId is not present in the request parameters', async () => {
            req.params.experimentId = undefined;

            try {
                await getExperimentById(req, res);
                // the test should fail if the above line doesn't throw an error
                expect.fail('Should have thrown PropertyNotFound error');
            } catch (error) {
                expect(error).to.be.instanceOf(PropertyNotFound);
                expect(error.message).to.equal(`Property: ${'experimentId'} not found...`);
                expect(res.statusCode).to.be.undefined;
                expect(res.data).to.be.undefined;
            }
        });

        it('should throw ServerUnableError if ExperimentRepository.retrieve() returns falsy value', async () => {
            const retrieveStub = sinon.stub(ExperimentRepository, 'retrieve').resolves(null);

            try {
                await getExperimentById(req, res);
                // the test should fail if the above line doesn't throw an error
                expect.fail('Should have thrown ServerUnableError');
            } catch (error) {
                expect(error).to.be.instanceOf(ServerUnableError);
                expect(error.message).to.equal(`Unable to ${'getExperimentById'} due to internal server error...`);
                expect(res.statusCode).to.be.undefined;
                expect(res.data).to.be.undefined;
            }

            retrieveStub.restore();
        });
    });

    describe('getExperimentsByAccountId', () => {
        let req, res;

        beforeEach(() => {
            req = {
                params: {
                    accountId: '68795'
                }
            };
            res = {
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.data = data;
                    return this;
                }
            };
        });

        it('should return the experiments and send the result as response with a 200 status code', async () => {
            const experiments = [{ accountId: '68795' }, { accountId: '98274' }];
            const findByAttributeStub = sinon.stub(ExperimentRepository, 'findByAttribute').resolves(experiments);
            await getExperimentsByAccountId(req, res);
            expect(res.statusCode).to.equal(200);
            expect(res.data).to.deep.equal(experiments);
            expect(findByAttributeStub).to.be.an('accountId', req.params.accountId);
            findByAttributeStub.restore();
        });

        it('should throw PropertyNotFound error if accountId is not present in the request parameters', async () => {
            req.params.accountId = undefined;

            try {
                await getExperimentsByAccountId(req, res);
                expect.fail('Should have thrown PropertyNotFound error');
            } catch (error) {
                expect(error).to.be.instanceOf(PropertyNotFound);
                expect(error.message).to.equal(`Property: ${'accountId'} not found...`);
                expect(res.statusCode).to.be.undefined;
                expect(res.data).to.be.undefined;
            }
        });

        it('should throw ServerUnableError if ExperimentRepository.findByAttribute() returns falsy value', async () => {
            const findByAttributeStub = sinon.stub(ExperimentRepository, 'findByAttribute').resolves(null);

            try {
                await getExperimentsByAccountId(req, res);
                expect.fail('Should have thrown ServerUnableError');
            } catch (error) {
                expect(error).to.be.instanceOf(ServerUnableError);
                expect(error.message).to.equal(`Unable to ${'getExperimentsByAccountId'} due to internal server error...`);
                expect(res.statusCode).to.be.undefined;
                expect(res.data).to.be.undefined;
            }

            findByAttributeStub.restore();
        });
    });

    describe('getExperimentsAB', () => {
        const req = {
            params: {
                accountId: '123'
            }
        };
        const res = {
            status: sinon.stub().returns({
                json: sinon.stub()
            })
        };

        afterEach(() => {
            sinon.restore();
        });

        it('should throw PropertyNotFound error if accountId is not provided', async () => {
            const reqWithoutAccountId = {
                params: {}
            };

            try {
                await getExperimentsAB(reqWithoutAccountId, res);
                expect.fail('Should have thrown an error');
            } catch (err) {
                expect(err).to.be.an.instanceOf(PropertyNotFound);
                expect(err.message).to.equal(`Property: ${'accountId'} not found...`);
            }
        });

        it('should throw ServerUnableError if no results are found', async () => {
            sinon.stub(ExperimentRepository, 'findByTwoAttributes').resolves(null);

            try {
                await getExperimentsAB(req, res);
                expect.fail('Should have thrown an error');
            } catch (err) {
                expect(err).to.be.an.instanceOf(ServerUnableError);
                expect(err.message).to.equal(`Unable to ${'getExperimentsAB'} due to internal server error...`);
            }
        });

        it('should return the experiments with type "a-b" and the given accountId', async () => {
            const expectedResults = [{ name: 'Experiment A' }, { name: 'Experiment B' }];
            sinon.stub(ExperimentRepository, 'findByTwoAttributes').resolves(expectedResults);

            await getExperimentsAB(req, res);

            sinon.assert.calledOnce(res.status);
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledOnce(res.status().json);
            sinon.assert.calledWith(res.status().json, expectedResults);
        });
    });
});
