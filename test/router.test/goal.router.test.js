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

        it('should return an error when given an invalid id', async () => {
            const req = {
                params: {
                    id: '$%%'
                }
            };
            const res = {
                status: (code) => {
                    expect(code).to.equal(404);
                    return {
                        send: (data) => {
                            expect(data).to.deep.equal({ error: `Property: ${'Goal not found'} not found...` });
                        }
                    };
                }
            };
            await goalController.retrieveGoalById(req, res);
        });
    });
});
