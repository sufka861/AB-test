const ExperimentRepository = require("../repositories/experiment.repository");
const GoalRepository = require('../repositories/goal.repository')
const {PropertyNotFound} = require("../errors/NotFound.errors");
const {ServerUnableError} = require("../errors/internal.errors");
const {BodyNotSent} = require("../errors/BadRequest.errors");
const {bodyValidator} = require("../validators/body.validator");


const createExperimentWithGoals = async (req, res) => {
    if (!bodyValidator(req)) throw new BodyNotSent();
    const {experiment, goals} = req.body;

    if (!experiment || !goals) throw new PropertyNotFound("Invalid request body for creating new experiment");

    const goalsId = [];
    goals.map(async (goal) => await GoalRepository.create(goal).then(newGoal => { if (!newGoal) throw ServerUnableError("Creating new goal") else goalsId.append(newGoal._id)}));
    experiment.goals = goalsId;
    const newExperiment = await  ExperimentRepository.create(experiment);
    if (!newExperiment) throw ServerUnableError("Creating new experiment");

    res.status(200).send(newExperiment);

}

export default createExperimentWithGoals;
