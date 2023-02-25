const cron = require("node-cron");
const ExperimentRepository = require("../repositories/experiment.repository");
const Experiment = require("../models/Experiment.model");
const experimentStatusUpdate =  ( ) => {
    const job = cron.schedule("0 8 * * *", async () => {
        console.log("doing cron job")
        const currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 2);
        const experiments = await ExperimentRepository.find();
        for (const experiment of experiments) {
            const start = new Date(experiment.duration.startTime);
            const end = new Date(experiment.duration.endTime);

            if (experiment.status === "planned" && currentTime >= start && currentTime <= end) {
                await ExperimentRepository.update(experiment._id, {status: "active"})
            } else if (experiment.status === "active" && currentTime >= end) {
                await ExperimentRepository.update(experiment._id, {status: "ended"})
            }
        }
    })
};

          cron.schedule("0 0 1 * *", async () => {
          await ExperimentRepository.resetMonthlyCallCount();
         });

     module.exports = {
        experimentStatusUpdate,
       }
