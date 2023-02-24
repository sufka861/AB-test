const cron = require("node-cron");
const ExperimentRepository = require("../repositories/experiment.repository");

const experimentStatusUpdate = async (startTime = new Date(), endTime = new Date(), status = true) => {
    const job = cron.schedule("0 8 * * *", async () => {
        const currentTime = new Date();
        const start = new Date(currentTime);
        const end = new Date(currentTime);
        start.setHours(...startTime.split(':'));
        end.setHours(...endTime.split(':'));

        if (currentTime >= start && currentTime <= end) {
            console.log('active');
            let query = {status: "planned"};
            let experiments = await ExperimentRepository.find();
            const plannedExperiments = await experiments.filter(el => el.status == "planned")
            console.log(plannedExperiments)
            plannedExperiments.forEach( async (experiment) => {
            await ExperimentRepository.update(experiment._id, {status: "active"})
            });


        }
        // Check if the current time is after the time interval
        else if (currentTime > end) {
            console.log('ended')
            let experiments = await ExperimentRepository.find();
            const activeExperiments = await experiments.filter(el => el.status == "active")
            console.log(activeExperiments)
            activeExperiments.forEach(async (experiment) => {
                await ExperimentRepository.update(experiment._id, {status: "ended"})
            });

        }

    })

    if (status === false) {
        console.log("stopped")
        job.stop()
        let experiments = await ExperimentRepository.find();
        const terminatedExperiments = await experiments.filter(el => el.status == "active")
        console.log(terminatedExperiments)
        terminatedExperiments.forEach(async (experiment) => {
            await ExperimentRepository.update(experiment._id, {status: "terminated"})
        });


    }
}


module.exports = {
    experimentStatusUpdate,
}
