const cron = require('node-cron');
const {ExperimentStorage} = require('../db/ExperimentStorage')
const ffLogic = require("./FeatureLogic");
const abLogic = require("./ABtest");
const Util = require("./utils");


async function checkExperimentTypeAndExecExperiment(experimentID, endUserReq) {

    const experiment = await ExperimentStorage.retrieve(experimentID);

    const {status, type} = experiment;

    if (Util.shouldAllow(experiment.traffic_percentage / 100)) {

        const experimentLogic = type === "f-f" ? ffLogic.featureCheckAttributes : abLogic.ABcheckAttributes;

        await ExperimentStorage.incCallCount(experiment._id);

        return experimentLogic(endUserReq, experiment);

    }
    return null;

}


async function experimentActiveAndEndCronJobs(experiment) {
    //startTime&endTime - Time in UTC!
    const {start_time, end_time} = experiment;
     const diffTime = end_time.getDate() - start_time.getDate()

    // cron.schedule(start_time, async () => {
    //     await ExperimentStorage.updateExperimentStatus(experiment._id, "active");
    // })
    // cron.schedule(end_time, async () => {
    //     await ExperimentStorage.updateExperimentStatus(experiment._id, "ended");
    // })

    const task = cron.schedule(start_time, () => {

        const intervalObj = setInterval(() => {
            exp.status = "active";
            if (Util.checkIfTerminated() == true) {
                clearInterval(intervalObj);
            }
        }, diffTime);
        clearInterval(intervalObj);
    });

    exp.status = "Ended";
    task.stop();
}

module.exports = {
    checkExperimentTypeAndExecExperiment,

}
