const { expect } = require('chai');
const sinon = require('sinon');
const { statsRouter } = require('../../router/stats.router');
const statsController = require('../../controller/stats.controller');

describe('Stats Router', () => {
    it('should retrieve user stats by ID', () => {
        const req = { params: { id: 1 } };
        const res = { json: sinon.spy() };
        const next = sinon.spy();
        sinon.stub(statsController, 'getUsersStats').resolves({ id: 1, stats: { views: 10, clicks: 5 } });

        statsRouter.handle(req, res, next);

        expect(statsController.getUsersStats.calledOnceWith(req.params.id)).to.be.true;
        expect(res.json.calledOnceWith({ id: 1, stats: { views: 10, clicks: 5 } })).to.be.true;
        expect(next.called).to.be.false;
    });
});
