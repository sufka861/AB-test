const {json} = require("express");
const ExperimentRepository = require("../repositories/experiment.repository");
const {PropertyNotFound} = require("../errors/NotFound.errors");
const {InvalidProperty} = require("../errors/validation.errors");
const {bodyValidator} = require("../validators/body.validator");
const {ServerUnableError} = require("../errors/internal.errors");
const experimentRepository = new ExperimentRepository();

const getAllExperiments = async (req, res) => {
    const result = await experimentRepository.find();
    res.status(200).json({result});
}

const getExperimentById = async (req, res) => {
    if (req.params.experiment_id) {
        const experiment_id = req.params.experiment_id;
        const result = await experimentRepository.retrieve(experiment_id);
        res.status(200).json({result});
    } else {
        throw new PropertyNotFound("experiment_id");
    }
}

const getExperimentsByAccountId = async (req, res) => {
    if (req.params.account_id) {
        const account_id = req.params.account_id;
        const experiments = await experimentRepository.findByAccount("account_id", account_id);
        res.status(200).json({experiments});
    } else {
        throw new PropertyNotFound("account_id");
    }
}

const getExperimentsAB = async (req, res) => {
    if (req.params.account_id) {
        const account_id = req.params.account_id;
        const result = await experimentRepository.findGroup("type", "a-b", "account_id", account_id);
        res.status(200).json({result});
    } else {
        throw new PropertyNotFound("account_id");
    }
}

const getExperimentsFF = async (req, res) => {
    if (req.params.account_id) {
        const account_id = req.params.account_id;
        const result = await experimentRepository.findGroup("type", "f-f", "account_id", account_id);
        res.status(200).json({result});
    } else {
        throw new PropertyNotFound("account_id");
    }
}

const getExperimentsByDate = async (req, res) => {
    if (req.query.year && req.query.month) {
        const year = req.query.year;
        const month = req.query.month;
        const result = await experimentRepository.findByDate(year, month);
        res.status(200).json({result});
    } else {
        throw new PropertyNotFound("year and month");
    }
}

const createExperiments = async (req, res) => {
    const result = await experimentRepository.create(req.body)
    res.status(200).json({result});
}

const updateExperimentsByID = async (req, res) => {
    if (req.params.experiment_id) {
        const experimentID = req.params.experiment_id;
        const result = await experimentRepository.update(experimentID, req.body)
        res.status(200).json({result});
    } else {
        throw new PropertyNotFound("experiment_id");
    }
}

const deleteExperimentsByID = async (req, res) => {
    if (req.params.experiment_id) {
        const experimentID = req.params.experiment_id;
        const result = await experimentRepository.delete(experimentID)
        res.status(200).json({result});
    } else {
        throw new PropertyNotFound("experiment_id");
    }
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
}