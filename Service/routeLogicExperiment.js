const cron = require('node-cron');
const {ExperimentStorage} = require('../db/ExperimentStorage')
const ffLogic = require("./FeatureLogic");
const abLogic = require("./ABtest");


async function checkExperimentTypeAndExecExperiment(req, res) {

    const experimentID = req.params.id;
    const endUserReq = req.body;
    const experiment = await ExperimentStorage.retrieve(experimentID);
    const {status, type} = experiment;

    const experimentLogic = type === "f-f" ? ffLogic.featureCheckAttributes :abLogic.ABcheckAttributes;

    if (status === 'active') {
        await ExperimentStorage.incCallCount(experiment._id);
        res.status(200).send(experimentLogic(endUserReq, experiment));
    } else
        res.status(200).send("Experiment status:" + status);
}


async function experimentActiveAndEndCronJobs(experiment) {
    //startTime&endTime - Time in UTC!
    const {start_time ,end_time} = experiment;
    const diffTime = end_time.getDate() - start_time.getDate()

    cron.schedule(start_time, async ()=>{
        await ExperimentStorage.updateExperimentStatus(experiment._id, "active");
    })
    cron.schedule(end_time, async  ()=>{
        await ExperimentStorage.updateExperimentStatus(experiment._id, "ended");
    })

    // const task = cron.schedule(start_time, () => {
    //
    //     const intervalObj = setInterval(() => {
    //         exp.status = "active";
    //         if (checkIfTerminated() == true) {
    //             clearInterval(intervalObj);
    //         }
    //     }, diffTime);
    //     clearInterval(intervalObj);
    // });

    // exp.status = "Ended";
    // task.stop();
}
module.exports ={
    checkExperimentTypeAndExecExperiment,

}
