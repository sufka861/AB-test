const cron = require("node-cron");
const ExperimentRepository = require("../repositories/experiment.repository");

const experimentStatusUpdate = async ( ) => {
    const job = cron.schedule("* * * * *", async () => {
        const currentTime = new Date();
        const experiments = ExperimentRepository.find();
        for (const experiment of experiments) {
            const start = new Date(experiment.duration.startTime);
            const end = new Date(experiment.duration.endTime);
            start.setHours(...start.split(':'));
            end.setHours(...end.split(':'));

            if (experiment.status === "planned" && currentTime >= start && currentTime <= end) {
                await ExperimentRepository.update(experiment._id, {status: "active"})
            } else if (experiment.status === "active" && currentTime >= end) {
                await ExperimentRepository.update(experiment._id, {status: "ended"})
            }
        }
    })
};


module.exports = {
        experimentStatusUpdate,
    }
