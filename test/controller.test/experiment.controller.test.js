const expect = require('chai').expect;
const sinon = require('sinon');
const { PropertyNotFound, BodyNotSent } = require("../../errors/NotFound.errors");
const { ServerUnableError } = require("../../errors/internal.errors");
const ExperimentRepository = require ('../../repositories/experiment.repository');
const {getAllExperiments,getExperimentById,getExperimentsByAccountId,getExperimentsAB,getExperimentsFF,getExperimentsByDate,addGoalToExperiment} = require ("../../controller/experiment.controller");


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

    describe('getExperimentsFF', () => {
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
                await getExperimentsFF(reqWithoutAccountId, res);
                expect.fail('Should have thrown an error');
            } catch (err) {
                expect(err).to.be.an.instanceOf(PropertyNotFound);
                expect(err.message).to.equal(`Property: ${'accountId'} not found...`);
            }
        });

        it('should throw ServerUnableError if no results are found', async () => {
            sinon.stub(ExperimentRepository, 'findByTwoAttributes').resolves(null);

            try {
                await getExperimentsFF(req, res);
                expect.fail('Should have thrown an error');
            } catch (err) {
                expect(err).to.be.an.instanceOf(ServerUnableError);
                expect(err.message).to.equal(`Unable to ${'getExperimentsFF'} due to internal server error...`);
            }
        });

        it('should return the experiments with type "f-f" and the given accountId', async () => {
            const expectedResults = [{ name: 'Experiment C' }, { name: 'Experiment D' }];
            sinon.stub(ExperimentRepository, 'findByTwoAttributes').resolves(expectedResults);

            await getExperimentsFF(req, res);

            sinon.assert.calledOnce(res.status);
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledOnce(res.status().json);
            sinon.assert.calledWith(res.status().json, expectedResults);
        });
    });


    describe('getExperimentsByDate', () => {
        it('should throw PropertyNotFound error if year or month not provided', async () => {
            const req = {
                query: {}
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            await expect(getExperimentsByDate(req, res)).to.be.an('PropertyNotFound');
        });

        it('should return a distribution of experiment counts by status', async () => {
            const req = {
                query: {
                    year: 2022,
                    month: 1
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            const findByDateStub = sinon.stub(ExperimentRepository, 'findByDate').resolves([
                { status: 'active', count: 2 },
                { status: 'ended', count: 5 },
                { status: 'terminated', count: 1 },
                { status: 'planned', count: 3 }
            ]);
            await getExperimentsByDate(req, res);
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, {
                active: 2,
                ended: 5,
                terminated: 1,
                planned: 3
            });
            findByDateStub.restore();
        });
    });


    describe("deleteExperimentsByID", () => {
        it("should throw an error if experimentId is not provided", async () => {
            const req = { params: {} };
            const res = { status: () => ({ json: () => {} }) };
            try {
                await deleteExperimentsByID(req, res);
            } catch (error) {
                expect(error).to.be.an.instanceOf(PropertyNotFound);
                expect(error.message).to.equal(`Property: ${"experimentId"} not found...`);
            }
        });

        it("should delete an experiment by ID and return the result", async () => {
            const experimentId = "1234567890";
            const req = { params: { experimentId } };
            const res = { status: (code) => ({ json: (result) => ({ code, result }) }) };
            const deleteStub = sinon.stub(ExperimentRepository, "delete").returns("Deleted");
            const result = await deleteExperimentsByID(req, res);
            expect(result).to.deep.equal({ code: 200, result: "Deleted" });
            deleteStub.restore();
        });

        it("should throw a ServerUnableError if delete operation fails", async () => {
            const experimentId = "1234567890";
            const req = { params: { experimentId } };
            const res = { status: () => ({ json: () => {} }) };
            const deleteStub = sinon.stub(ExperimentRepository, "delete").returns(null);
            try {
                await deleteExperimentsByID(req, res);
            } catch (error) {
                expect(error).to.be.an.instanceOf(ServerUnableError);
                expect(error.message).to.equal(`Unable to ${"deleteExperimentsByID"} due to internal server error...`);
            }
            deleteStub.restore();
        });
    });


    describe('addGoalToExperiment', () => {
        it('should throw a PropertyNotFound error if experimentId is missing', async () => {
            const req = { params: { goalId: '123' } };
            const res = {};
            const next = sinon.stub();

            try {
                await addGoalToExperiment(req, res, next);
                throw new Error('Expected addGoalToExperiment to throw PropertyNotFound');
            } catch (error) {
                expect(error).to.be.an.instanceOf(PropertyNotFound);
                expect(error.message).to.equal(`Property: ${'experimentId'} not found...`);
                expect(next.called).to.be.false;
            }
        });

        it('should throw a PropertyNotFound error if goalId is missing', async () => {
            const req = { params: { experimentId: '123' } };
            const res = {};
            const next = sinon.stub();

            try {
                await addGoalToExperiment(req, res, next);
                throw new Error('Expected addGoalToExperiment to throw PropertyNotFound');
            } catch (error) {
                expect(error).to.be.an.instanceOf(PropertyNotFound);
                expect(error.message).to.equal(`Property: ${'goalId'} not found...`);
                expect(next.called).to.be.false;
            }
        });

        it('should throw a ServerUnableError error if ExperimentRepository.addGoal fails', async () => {
            const req = { params: { experimentId: '123', goalId: '456' } };
            const res = {};
            const next = sinon.stub();
            const addGoalStub = sinon.stub(ExperimentRepository, 'addGoal').resolves(null);

            try {
                await addGoalToExperiment(req, res, next);
                throw new Error('Expected addGoalToExperiment to throw ServerUnableError');
            } catch (error) {
                expect(error).to.be.an.instanceOf(ServerUnableError);
                expect(error.message).to.equal(`Unable to ${'addGoalToExperiment'} due to internal server error...`);
                expect(next.called).to.be.false;
            } finally {
                addGoalStub.restore();
            }
        });

        it('should call res.status and res.json with the result returned by ExperimentRepository.addGoal', async () => {
            const req = { params: { experimentId: '123', goalId: '456' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub().returnsThis() };
            const next = sinon.stub();
            const expectedResult = { id: '789', experimentId: '123', goalId: '456' };
            const addGoalStub = sinon.stub(ExperimentRepository, 'addGoal').resolves(expectedResult);

            await addGoalToExperiment(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(expectedResult)).to.be.true;
            expect(next.called).to.be.false;

            addGoalStub.restore();
        });
    });

    describe("addGoalToExperiment", function () {
        let req, res, ExperimentRepository, addGoalStub;

        beforeEach(function () {
            req = {
                params: {
                    experimentId: "123",
                    goalId: "456",
                },
            };

            res = {
                status: sinon.stub().returns({
                    json: sinon.stub(),
                }),
            };

            ExperimentRepository = {
                addGoal: sinon.stub(),
            };

            addGoalStub = ExperimentRepository.addGoal;
        });

        it("should throw a PropertyNotFound error if experimentId is not provided", async function () {
            delete req.params.experimentId;

            try {
                await addGoalToExperiment(req, res);
                assert.fail("Expected a PropertyNotFound error to be thrown");
            } catch (error) {
                assert.equal(error.message, "experimentId not found");
            }
        });

        it("should throw a PropertyNotFound error if goalId is not provided", async function () {
            delete req.params.goalId;

            try {
                await addGoalToExperiment(req, res);
                assert.fail("Expected a PropertyNotFound error to be thrown");
            } catch (error) {
                assert.equal(error.message, "goalId not found");
            }
        });

        it("should call ExperimentRepository.addGoal with the correct parameters", async function () {
            addGoalStub.returns("some value");

            await addGoalToExperiment(req, res);

            sinon.assert.calledOnceWithExactly(
                addGoalStub,
                req.params.experimentId,
                req.params.goalId
            );
        });

        it("should return the value returned by ExperimentRepository.addGoal", async function () {
            addGoalStub.returns("some value");

            await addGoalToExperiment(req, res);

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledOnce(res.status().json);
            sinon.assert.calledWith(res.status().json, "some value");
        });

        it("should throw a ServerUnableError if ExperimentRepository.addGoal returns falsy value", async function () {
            addGoalStub.returns(null);

            try {
                await addGoalToExperiment(req, res);
                assert.fail("Expected a ServerUnableError error to be thrown");
            } catch (error) {
                assert.equal(error.message, "Server unable to add goal to experiment");
            }
        });
    });

});
