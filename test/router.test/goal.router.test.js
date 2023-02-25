const { expect } = require('chai');
const goalController = require('../../controller/goal.controller');

describe('Goal Controller', () => {
    describe('retrieveGoalById', () => {
        it('should return the correct goal when given a valid id', async () => {
            const req = {
                params: {
                    id: '1'
                }
            };
            const res = {
                json: (data) => {
                    expect(data).to.deep.equal({ id: '1', name: 'My Goal' });
                }
            };
            await goalController.retrieveGoalById(req, res);
            expect(res.statusCode).to.equal(200);
        });

        it('should return a 404 error when given an invalid id', async () => {
            const req = {
                params: {
                    id: '999'
                }
            };
            const res = {
                status: (code) => {
                    expect(code).to.equal(404);
                    return {
                        send: (data) => {
                            expect(data).to.deep.equal({ error: 'Goal not found' });
                        }
                    };
                }
            };
            await goalController.retrieveGoalById(req, res);
        });
    });
});
