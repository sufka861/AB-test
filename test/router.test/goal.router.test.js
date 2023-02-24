const { expect } = require('chai');
const sinon = require('sinon');
const { goalRouter } = require('../../router/goal.router');
const goalController = require('../../controller/goal.controller');


describe('Goal Controller', () => {
    it('should retrieve a goal by ID', () => {

        const req = { params: { id: 1 } };
        const res = { json: sinon.spy() };
        const next = sinon.spy();
        sinon.stub(goalController, 'retrieveGoalById').resolves({ id: 1, name: 'test' });

        goalRouter.handle(req, res, next);

        expect(goalController.retrieveGoalById.calledOnceWith(req.params.id)).to.be.true;
        expect(res.json.calledOnceWith({ id: 1, name: 'test' })).to.be.true;
        expect(next.called).to.be.false;
    });
});
