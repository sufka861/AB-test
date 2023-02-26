const expect = require('chai').expect;
const sinon = require('sinon');
const GoalController = require('../../controller/goal.controller');
const GoalRepository = require('../../repositories/goal.repository');
const { PropertyNotFound, BodyNotSent } = require("../../errors/NotFound.errors");
const { ServerUnableError } = require("../../errors/internal.errors");
const goalController = require ("../../controller/goal.controller");
const ExperimentRepository = require ('../../repositories/experiment.repository');
const assert = require('chai').assert;
// const BodyNotSent = require('../../validators/body.validator');


    describe('GoalController', () => {

        describe('getVariantSuccessCountByGoalID', () => {
            it('should call GoalRepository.getVariantSuccessCount with the correct ID', async () => {
                const id = '1234';
                const req = {params: {id}};
                const res = {status: sinon.stub().returnsThis(), send: sinon.stub()};
                const getVariantSuccessCountStub = sinon.stub(GoalRepository, 'getVariantSuccessCount').resolves({count: 5});

                await GoalController.getVariantSuccessCountByGoalID(req, res);

                expect(getVariantSuccessCountStub.calledOnceWith(id)).to.be.true;
                expect(res.status.calledWith(200)).to.be.true;
                expect(res.send.calledWith({count: 5})).to.be.true;

                getVariantSuccessCountStub.restore();
            });

            it('should throw a PropertyNotFound error if ID is not provided', async () => {
                const req = {params: {}};
                const res = {status: sinon.stub().returnsThis(), send: sinon.stub()};

                try {
                    await GoalController.getVariantSuccessCountByGoalID(req, res);
                } catch (error) {
                    expect(error).to.be.instanceOf(PropertyNotFound);
                    expect(error.message).to.equal(`Property: ${'getVariantSuccessCountByExperimentID'} not found...`);
                }
            });
        })
    })

describe('Experiment endpoints', function () {

    describe('incVariantByGoalID', function () {
        it('should throw PropertyNotFound error if id or variant is missing', async function () {
            const req = {params: {id: '1234'}, body: {variant: 'BLUE'}};

            const id = req.params.id;
            const variant = req.body;

            try {
                await GoalRepository.incVariantSuccessCount(id, variant);

            } catch (error) {
                expect(error).to.be.instanceOf(PropertyNotFound);
                expect(error.message).to.equal(`Property: ${'getCallCountByExperimentID'} not found...`);
            }

        });

        it('should call GoalRepository.incVariantSuccessCount and return its result', async function () {
            const req = {params: {id: 'goal_id'}, body: {variant: 'variant_name'}};
            const expectedResult = {success: true};
            sinon.stub(GoalRepository, 'incVariantSuccessCount').resolves(expectedResult);
            const res = {status: sinon.stub(), send: sinon.stub()};
            res.status.returns(res);

            await incVariantByGoalID(req, res);

            sinon.assert.calledOnceWithExactly(GoalRepository.incVariantSuccessCount, 'goal_id', 'variant_name');
            sinon.assert.calledOnceWithExactly(res.status, 200);
            sinon.assert.calledOnceWithExactly(res.send, expectedResult);

            GoalRepository.incVariantSuccessCount.restore();
        });
    });

    describe('getCallCountByExperimentID', function () {
        it('should throw PropertyNotFound error if id is missing', async function () {
            const req = {params: {}};
            const res = {};
            const next = sinon.spy();


            try {
                await GoalController.getCallCountByExperimentID(req, res);
            } catch (error) {
                expect(error).to.be.instanceOf(PropertyNotFound);
                expect(error.message).to.equal(`Property: ${'getCallCountByExperimentID'} not found...`);
            }
        });

        it('should call ExperimentRepository.getCallCount and return its result', async function () {
            const req = {params: {id: 'experiment_id'}};
            const expectedResult = {callCount: 42};
            sinon.stub(ExperimentRepository, 'getCallCount').resolves(expectedResult.callCount);
            const res = {status: sinon.stub(), json: sinon.stub()};
            res.status.returns(res);

            await getCallCountByExperimentID(req, res);

            sinon.assert.calledOnceWithExactly(ExperimentRepository.getCallCount, 'experiment_id');
            sinon.assert.calledOnceWithExactly(res.status, 200);
            sinon.assert.calledOnceWithExactly(res.json, expectedResult);

            ExperimentRepository.getCallCount.restore();
        });
    });

    describe('getVariantSuccessCountByGoalID', function () {
        it('should throw PropertyNotFound error if id is missing', async function () {
            const req = {params: {}};
            const res = {};
            const next = sinon.spy();

            try {
                await GoalController.getVariantSuccessCountByGoalID(req, res, next);
            } catch (error) {
                expect(error).to.be.instanceOf(PropertyNotFound);
                expect(error.message).to.equal(`Property: ${'getVariantSuccessCountByExperimentID'} not found...`);
            }
        });

    });


    describe('Goal Controller', () => {
        describe('deleteGoal()', () => {
            it('should delete a goal by id', async () => {
                const req = {
                    params: {
                        id: '12345'
                    }
                };
                const res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.stub()
                };
                const deleteStub = sinon.stub(GoalRepository, 'delete').resolves(true);

                await goalController.deleteGoal(req, res);

                sinon.assert.calledOnce(deleteStub);
                sinon.assert.calledWith(deleteStub, '12345');
                sinon.assert.calledOnce(res.status);
                sinon.assert.calledWith(res.status, 200);
                sinon.assert.calledOnce(res.send);
                sinon.assert.calledWith(res.send, true);

                deleteStub.restore();
            });

            it('should throw a PropertyNotFound error when goalId is not provided', async () => {
                const req = {
                    params: {}
                };
                const res = {};
                const deleteStub = sinon.stub(GoalRepository, 'delete').resolves(true);

                try {
                    await goalController.deleteGoal(req, res);
                } catch (error) {
                    sinon.assert.match(error.message, /Goal Id in deleteGoal/);
                }

                sinon.assert.notCalled(deleteStub);

                deleteStub.restore();
            });

            it('should throw a ServerUnableError when the delete operation fails', async () => {
                const req = {
                    params: {
                        id: '12345'
                    }
                };
                const res = {
                    status: sinon.stub().returnsThis(),
                    send: sinon.stub()
                };
                const deleteStub = sinon.stub(GoalRepository, 'delete').resolves(false);

                try {
                    await goalController.deleteGoal(req, res);
                } catch (error) {
                    sinon.assert.match(error.message, /Deleting goal id: 12345/);
                }

                sinon.assert.calledOnce(deleteStub);
                sinon.assert.calledWith(deleteStub, '12345');
                sinon.assert.notCalled(res.status);
                sinon.assert.notCalled(res.send);

                deleteStub.restore();
            });
        });

    });
});
