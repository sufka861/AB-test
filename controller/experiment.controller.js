
const ExperimentRepository = require("../repositories/experiment.repository");
const {PropertyNotFound} = require("../errors/NotFound.errors");
const {ServerUnableError} = require("../errors/internal.errors");
const {bodyValidator} = require("../validators/body.validator");
const {BodyNotSent} = require("../errors/BadRequest.errors");

const getAllExperiments = async (req, res) => {
    const result = await ExperimentRepository.find();
    if (!result) throw new ServerUnableError("getAllExperiments")
    res.status(200).json(result);
};

const getExperimentById = async (req, res) => {
    if (!req.params.experiment_id) throw new PropertyNotFound("experiment_id");
    const experiment_id = req.params.experiment_id;
    const result = await ExperimentRepository.retrieve(experiment_id);
    if (!result) throw new ServerUnableError("getExperimentById")
    res.status(200).json(result);
};

const getExperimentsByAccountId = async (req, res) => {
    if (!req.params.account_id) throw new PropertyNotFound("account_id");
    const account_id = req.params.account_id;
    const result = await ExperimentRepository.findByAttribute("account_id", account_id);
    if (!result) throw new ServerUnableError("getExperimentsByAccountId")
    res.status(200).json(result);
}

const getExperimentsAB = async (req, res) => {
    if (!req.params.account_id) throw new PropertyNotFound("account_id");
    const account_id = req.params.account_id;
    const result = await ExperimentRepository.findByTwoAttributes("type", "a-b", "account_id", account_id);
    if (!result) throw new ServerUnableError("getExperimentsAB")
    res.status(200).json(result);

}

const getExperimentsFF = async (req, res) => {
    if (!req.params.account_id) throw new PropertyNotFound("account_id");
    const account_id = req.params.account_id;
    const result = await ExperimentRepository.findByTwoAttributes("type", "f-f", "account_id", account_id);
    if (!result) throw new ServerUnableError("getExperimentsFF")
    res.status(200).json(result);

}

const getExperimentsByDate = async (req, res) => {
    if (!req.query.year && req.query.month) throw new PropertyNotFound("year and month");
    const year = req.query.year;
    const month = req.query.month;
    const result = await ExperimentRepository.findByDate(year, month);
    if (!result) throw new ServerUnableError("getExperimentsByDate")
    res.status(200).json(result);
}

const createExperiments = async (req, res) => {
    if (!bodyValidator(req)) throw new BodyNotSent();
    const result = await ExperimentRepository.create(req.body)
    if (!result) throw new ServerUnableError("createExperiments")
    res.status(200).json(result);
}

const updateExperimentsByID = async (req, res) => {
    if (!req.params.experiment_id) throw new PropertyNotFound("experiment_id");
    const experimentID = req.params.experiment_id;
    const result = await ExperimentRepository.update(experimentID, req.body)
    if (!result) throw new ServerUnableError("updateExperimentsByID")
    res.status(200).json(result);
}

const deleteExperimentsByID = async (req, res) => {
    if (!req.params.experiment_id) throw new PropertyNotFound("experiment_id");
    const experimentID = req.params.experiment_id;
    const result = await ExperimentRepository.delete(experimentID)
    if (!result) throw new ServerUnableError("deleteExperimentsByID")
    res.status(200).json(result);
}
const addGoalToExperiment = async (req,res) =>{
    if (!req.params.experiment_id) throw new PropertyNotFound("experimentId");
    if (!req.params.goal_id) throw new PropertyNotFound("goalId");
    const result = await ExperimentRepository.addGoal(req.params.experiment_id, req.params.goal_id)
    if (!result) throw new ServerUnableError("addGoalToExperiment")
    res.status(200).json(result);
}
const removeGoalToExperiment = async (req,res) =>{
    if (!req.params.experiment_id) throw new PropertyNotFound("experimentId");
    if (!req.params.goal_id) throw new PropertyNotFound("goalId");
    const result = await ExperimentRepository.removeGoal(req.params.experiment_id, req.params.goal_id)
    if (!result) throw new ServerUnableError("removeGoalToExperiment")
    res.status(200).json(result);
}

module.exports = {
    getAllExperiments,
    getExperimentById,
    getExperimentsByAccountId,
    getExperimentsAB,
    getExperimentsFF,
    getExperimentsByDate,
    updateExperimentsByID,
    deleteExperimentsByID,
    createExperiments,
    addGoalToExperiment,
    removeGoalToExperiment
}
