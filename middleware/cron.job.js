const cron = require("node-cron");
const Util = require("../Service/utils");


const experimentActiveAndEndCronJobs = (experiment)=> {
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
    experimentActiveAndEndCronJobs
}