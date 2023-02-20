const cron = require("node-cron");
const ExperimentRepository = require("../repositories/experiment.repository");

const experimentStatusUpdate =(startTime, endTime) => {
    cron.schedule("* * * * *", async () => {
        const currentTime = new Date();
        const start = new Date(currentTime);
        const end = new Date(currentTime);
        start.setHours(...startTime.split(':'));
        end.setHours(...endTime.split(':'));

        if (currentTime >= start && currentTime <= end) {
            console.log('active');
            const now = new Date();
            let query = {status: "planned", duration: {start_time:{$lte: now}, end_time: {$gte: now}}};
            let experiments = await ExperimentRepository.findByQuery(query);
            experiments.forEach((experiment) => {
                ExperimentRepository.update(experiment._id, {status: "active"})
            });

          }
          // Check if the current time is after the time interval
          else if (currentTime > end) {
            console.log('ended')
            query = {status: "active", duration: {end_time:{$gte: now}, start_time: {$lte: now}}};
            experiments = await ExperimentRepository.findByQuery(query);
            experiments.forEach((experiment) => {
                ExperimentRepository.update(experiment._id, {status: "ended"})
            });
          }


    })
}



module.exports = {
    experimentStatusUpdate,
}