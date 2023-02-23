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
    const newGoals =  await GoalRepository.createMany(goals);
    if(!newGoals) throw new ServerUnableError("creating new goals")
    experiment.goals = newGoals.map(goal => goal._id);
    const newExperiment = await ExperimentRepository.create(experiment);
    if (!newExperiment) throw ServerUnableError("Creating new experiment");
    res.status(200).send(newExperiment);
}

module.exports = {createExperimentWithGoals};
