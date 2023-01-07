const cron = require("node-cron");
const Util = require("../Service/utils");
const ExperimentRepository = require("../repositories/experiment.repository");

const experimentStatusUpdate = cron.schedule("0 0 * * *", async () => {
    const now = new Date();
    const query = {status: "planned", duration : { start_time: {$gte: now}}}
    const experiments = await ExperimentRepository.findByQuery(query);
    console.log(experiments);

})



module.exports = {
    experimentStatusUpdate,
}

//
// const experimentActiveAndEndCronJobs = (experiment)=> {
//     //startTime&endTime - Time in UTC!
//     const {start_time, end_time} = experiment;
//     const diffTime = end_time.getDate() - start_time.getDate()
//
//     // cron.schedule(start_time, async () => {
//     //     await ExperimentStorage.updateExperimentStatus(experiment._id, "active");
//     // })
//     // cron.schedule(end_time, async () => {
//     //     await ExperimentStorage.updateExperimentStatus(experiment._id, "ended");
//     // })
//
//     const task = cron.schedule(start_time, () => {
//
//         const intervalObj = setInterval(() => {
//             exp.status = "active";
//             if (Util.checkIfTerminated() == true) {
//                 clearInterval(intervalObj);
//             }
//         }, diffTime);
//         clearInterval(intervalObj);
//     });
//
//     exp.status = "Ended";
//     task.stop();
// }
//
// module.exports = {
//     experimentActiveAndEndCronJobs
// }