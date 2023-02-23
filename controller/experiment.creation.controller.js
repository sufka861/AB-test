const ExperimentRepository = require("../repositories/experiment.repository");
const GoalRepository = require('../repositories/goal.repository')
const {PropertyNotFound} = require("../errors/NotFound.errors");
const {ServerUnableError} = require("../errors/internal.errors");
const {BodyNotSent} = require("../errors/BadRequest.errors");
const {bodyValidator} = require("../validators/body.validator");
const {isLogForwardingEnabled} = require("newrelic/lib/util/application-logging");
const {log} = require("winston");


const createExperimentWithGoals = async (req, res) => {
    if (!bodyValidator(req)) throw new BodyNotSent();
    const {experiment, goals} = req.body;

    if (!experiment || !goals) throw new PropertyNotFound("Invalid request body for creating new experiment");


    experiment.goals = await Promise.all(goals.map(async (goal) => {
           return await GoalRepository.create(goal)
               .then(newGoal => newGoal._id)
                .catch(err => console.log(err))
        }
    ));

    const newExperiment = await ExperimentRepository.create(experiment);

    if (!newExperiment) throw ServerUnableError("Creating new experiment");

    res.status(200).send(newExperiment);

}

module.exports = {createExperimentWithGoals};
