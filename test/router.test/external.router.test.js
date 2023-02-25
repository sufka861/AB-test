const { expect } = require('chai');
const sinon = require('sinon');
const { testRouter } = require('../../router/external.routes');
const { runTest, reportGoal } = require('../../controller/external.controller');

describe('Test Router', () => {
    describe('POST /run', () => {
        it('should call runTest controller method', () => {
            const runTestStub = sinon.stub().resolves('test results');
            const req = { body: { testConfig: {} } };
            const res = { send: sinon.stub() };
            const next = sinon.stub();

            sinon.replace(runTest, 'runTest', runTestStub);

            return testRouter(req, res, next).then(() => {
                expect(runTestStub.calledOnceWith(req.body.testConfig)).to.be.true;
                expect(res.send.calledOnceWith('test results')).to.be.true;
            });
        });
    });

    describe('PUT /report-goal', () => {
        it('should call reportGoal controller method', () => {
            const reportGoalStub = sinon.stub().resolves('goal reported');
            const req = { body: { goalId: 'goal1', value: 100 } };
            const res = { send: sinon.stub() };
            const next = sinon.stub();

            sinon.replace(reportGoal, 'reportGoal', reportGoalStub);

            return testRouter(req, res, next).then(() => {
                expect(reportGoalStub.calledOnceWith(req.body.goalId, req.body.value)).to.be.true;
                expect(res.send.calledOnceWith('goal reported')).to.be.true;
            });
        });
    });
});
