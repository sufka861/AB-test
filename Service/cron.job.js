const cron = require("node-cron");
const ExperimentRepository = require("../repositories/experiment.repository");

const experimentStatusUpdate = cron.schedule("* 0 * * *", async () => {
    const now = new Date();
    let query = {status: "planned", duration: {startTime:{$lte: now}, endTime: {$gte: now}}};
    let experiments = await ExperimentRepository.findByQuery(query);
    experiments.forEach((experiment) => {
        ExperimentRepository.update(experiment._id, {status: "active"})
    });

    query = {status: "active", duration: {endTime:{$gte: now}, startTime: {$lte: now}}};
    experiments = await ExperimentRepository.findByQuery(query);
    experiments.forEach((experiment) => {
        ExperimentRepository.update(experiment._id, {status: "ended"})
    });
})

module.exports = {
    experimentStatusUpdate,
}