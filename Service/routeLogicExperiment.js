const cron = require('node-cron');
const {ExperimentStorage} = require('../db/ExperimentStorage')
const ffLogic = require("./FeatureLogic");
const abLogic = require("./ABtest");
const Util = require("./utils");


const checkExperimentTypeAndExecExperiment = async (experimentID, endUserReq)=> {

    const experiment = await ExperimentStorage.retrieve(experimentID);

    const {status, type} = experiment;

    if (Util.shouldAllow(experiment.traffic_percentage / 100)) {

        const experimentLogic = type === "f-f" ? ffLogic.featureCheckAttributes : abLogic.ABcheckAttributes;

        await ExperimentStorage.incCallCount(experiment._id);

        return experimentLogic(endUserReq, experiment);

    }
    return null;

}

module.exports = {
    checkExperimentTypeAndExecExperiment,
    experimentActiveAndEndCronJobs

}
