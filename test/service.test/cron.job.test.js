const { expect } = require('chai');
const sinon = require('sinon');
const cron = require('node-cron');
const Experiment = require
const { experimentStatusUpdate } = require("../../Service/cron.job");
const ExperimentRepository = require("../../repositories/experiment.repository");

describe('experimentStatusUpdate', () => {
    let clock;

    beforeEach(() => {
        // Create a fake clock to control the timing of cron jobs
        clock = sinon.useFakeTimers(new Date('2022-01-01T10:00:00.000Z').getTime());
    });

    afterEach(() => {
        // Restore the original clock
        clock.restore();
    });

    it('should update experiment status from "planned" to "active"', async () => {
        // Mock the ExperimentRepository.findByQuery method
        const mockFindByQuery = sinon.stub(ExperimentRepository, 'findByQuery').resolves([{
            _id: 'experiment1',
            status: 'planned',
            duration: {
                startTime: new Date('2022-01-01T10:10:00.000Z'),
                endTime: new Date('2022-01-02T11:12:00.000Z'),
            },
        }]);

        // Mock the ExperimentRepository.update method
        const mockUpdate = sinon.stub(ExperimentRepository, 'update').resolves({
            _id: 'experiment1',
            status: 'active',
            duration: {
                startTime: new Date('2022-01-01T00:00:00.000Z'),
                endTime: new Date('2022-01-02T00:00:00.000Z'),
            },
        });

        // Run the experimentStatusUpdate cron job
        await experimentStatusUpdate.run();

        // Verify that the findByQuery method was called with the correct query
        expect(mockFindByQuery.calledWith({
            status: 'planned',
            duration: {
                startTime: {$lte: new Date('2022-01-01T00:00:00.000Z')},
                endTime: {$gte: new Date('2022-01-01T00:00:00.000Z')},
            },
        })).to.be.true;

        // Verify that the update method was called with the correct parameters
        expect(mockUpdate.calledWith('experiment1', {status: 'active'})).to.be.true;

        // Restore the original methods
        mockFindByQuery.restore();
        mockUpdate.restore();
    });

    it('should update experiment status from "active" to "ended"', async () => {
        // Mock the ExperimentRepository.findByQuery method
        const mockFindByQuery = sinon.stub(ExperimentRepository, 'findByQuery').resolves([{
            _id: 'experiment1',
            status: 'active',
            duration: {
                startTime: new Date('2022-01-01T00:00:00.000Z'),
                endTime: new Date('2022-01-02T00:00:00.000Z'),
            },
        }]);

        // Mock the ExperimentRepository.update method
        const mockUpdate = sinon.stub(ExperimentRepository, 'update').resolves({
            _id: 'experiment1',
            status: 'ended',
            duration: {
                startTime: new Date('2022-01-01T00:00:00.000Z'),
                endTime: new Date('2022-01-02T00:00:00.000Z'),
            },
        })
    })
});
