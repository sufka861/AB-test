const cron = require("node-cron");
const ExperimentRepository = require("../repositories/experiment.repository");

const experimentStatusUpdate =async(startTime = new Date(), endTime = new Date() , status = true , experimentId) => {
   const job =   cron.schedule("* * * * *", async () => {
        const currentTime = new Date();
        const start = new Date(currentTime);
        const end = new Date(currentTime);
        start.setHours(...startTime.split(':'));
        end.setHours(...endTime.split(':'));

        if (currentTime >= start && currentTime <= end) {
            let experiments = await ExperimentRepository.update(experimentId, {status: "active"})

          }
          // Check if the current time is after the time interval
          else if (currentTime > end) {
            let experiments = await ExperimentRepository.update(experimentId, {status: "ended"})
          }

    })

    if(status === false){
        job.stop()
        let experiments = await  ExperimentRepository.update(experimentId, {status: "terminated"})

    }
}



module.exports = {
    experimentStatusUpdate,
}
