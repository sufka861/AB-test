const { expect } = require('chai');
const sinon = require('sinon');
const cron = require('node-cron');
const ExperimentRepository = require('../../repositories/experiment.repository');
const {experimentStatusUpdate} = require('../../Service/cron.job');

describe('Experiment Status Update', () => {
    let clock;

    before(() => {
        clock = sinon.useFakeTimers(new Date('2023-02-25T15:30:00Z'));
    });

    after(() => {
        clock.restore();
    });

    it('should update experiment status to active when start time is reached', async () => {
        const experiments = [      {        _id: '1',        duration: {          startTime: new Date('2023-02-25T15:30:00Z'),          endTime: new Date('2023-02-25T15:33:00Z')        },        status: 'planned'      }    ];
        sinon.stub(ExperimentRepository, 'find').resolves(experiments);
        sinon.stub(ExperimentRepository, 'update').resolves();

        await experimentStatusUpdate();

        expect(ExperimentRepository.find.calledOnce).to.be.true;
        expect(ExperimentRepository.update.calledOnceWith('1', { status: 'active' })).to.be.true;
        console.log (expect);
    });

    it('should update experiment status to ended when end time is reached', async () => {

        const experiments = [{ _id: '2',duration: {startTime: new Date('2023-02-25T09:00:00Z'),
        endTime: new Date('2023-02-25T10:00:00Z')},
        status: 'active'
        }];
        sinon.stub(ExperimentRepository, 'find').resolves(experiments);
        sinon.stub(ExperimentRepository, 'update').resolves();
        await experimentStatusUpdate();
        expect(ExperimentRepository.find.calledOnce).to.be.true;
        expect(ExperimentRepository.update.calledOnceWith('2', { status: 'ended' })).to.be.true;
    });

    it('should not update experiment status when current time is outside experiment duration', async () => {
        // Arrange
        const experiments = [{ _id: '3',duration: {startTime: new Date('2023-02-25T09:00:00Z'),endTime: new Date('2023-02-25T10:00:00Z')
            },status: 'planned'}];
        sinon.stub(ExperimentRepository, 'find').resolves(experiments);
        sinon.stub(ExperimentRepository, 'update').resolves();
        await experimentStatusUpdate();
        expect(ExperimentRepository.find.calledOnce).to.be.true;
        expect(ExperimentRepository.update.called).to.be.false;
    });
});
