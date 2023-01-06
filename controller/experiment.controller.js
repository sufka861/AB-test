const {json} = require("express");
const ExperimentRepository = require("../repositories/experiment.repository");
const experimentRepository = new ExperimentRepository();

const getAllExperiments = async (req, res) => {
    const result = await experimentRepository.find();
    res.status(200).json({ result });
}

const getExperimentById = async (req, res) => {
    if (req.params.experiment_id) {
        const experiment_id = req.params.experiment_id;
        const result = await experimentRepository.retrieve(experiment_id);
        res.status(200).json({ result });
    }
}

const getExperimentsByAccountId = async (req, res) => {
    if (req.params.account_id) {
        const account_id = req.params.account_id;
        const experiments = await experimentRepository.findByAccount("account_id", account_id);
        res.status(200).json( {experiments});
    }
}

const getExperimentsAB = async (req, res) => {
    const account_id = req.params.account_id;
    const result = await experimentRepository.findGroup("type", "a-b", "account_id", account_id);
    res.status(200).json({ result });
}

const getExperimentsFF = async (req, res) => {
    const account_id = req.params.account_id;
    const result = await experimentRepository.findGroup("type", "f-f", "account_id", account_id);
    res.status(200).json({ result });
}

const getVariantByExperimentId = async (req, res) => {
    res.sendStatus(200);
    res.send();
}

const getExperimentsByDate = async (req, res) => {
    const year = req.query.year;
    const month = req.query.month;
    const result = await experimentRepository.findByDate(year, month);
    res.status(200).json({ result });
}

const createExperiments = async (req, res) => {
    const result = await experimentRepository.create(req.body)
    res.status(200).json({ result });
}

const updateExperimentsByID = async (req, res) => {
    const experimentID = req.params.experiment_id;
    const result = await experimentRepository.update(experimentID, req.body)
    res.status(200).json({ result });
}

const deleteExperimentsByID = async (req, res) => {
    const experimentID = req.params.experiment_id;
    const result = await experimentRepository.delete(experimentID)
    res.status(200).json({ result });
}

const runExperiment = async (req, res) => {

}

const declareGoal = async (req, res) => {

}


module.exports = {
    getAllExperiments,
    getExperimentById,
    getExperimentsByAccountId,
    getExperimentsAB,
    getExperimentsFF,
    getVariantByExperimentId,
    getExperimentsByDate,
    updateExperimentsByID,
    deleteExperimentsByID,
    createExperiments,
    runExperiment,
    declareGoal,
}