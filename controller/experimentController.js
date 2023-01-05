const MongoStorage = require('../db/MongoStorage');
const experimentDB = new MongoStorage("experiment");

async function getAllExperiments(req, res) {
    res.send(await experimentDB.find());
}

async function getExperimentById(req, res) {
    if (req.params.experiment_id) {
        const experiment_id = req.params.experiment_id;
        res.send(await experimentDB.retrieve(experiment_id));
    }
}

async function getExperimentsByAccountId(req, res) {
    if (req.params.account_id) {
        const account_id = req.params.account_id;
        res.send(await experimentDB.findByAccount("account_id", account_id));
    }
}

async function getExperimentsAB(req, res) {
    res.send(await experimentDB.findGroup("type", "a-b"));
}

async function getExperimentsFF(req, res) {
    res.send(await experimentDB.findGroup("type", "f-f"));
}

async function createExperiments(req, res) {
    res.send(await experimentDB.create(req.body));
}

async function updateExperimentsByID(req, res) {
    const experimentID = req.params.experiment_id;
    res.send(await experimentDB.update(experimentID, req.body));
}

async function deleteExperimentsByID(req, res) {
    const experimentID = req.params.experiment_id;
    res.send(await experimentDB.delete(experimentID));
}

async function runExperiment(req, res) {

}

async function declareGoal(req, res) {

}


module.exports = {
    getAllExperiments,
    getExperimentById,
    getExperimentsByAccountId,
    getExperimentsAB,
    getExperimentsFF,
    updateExperimentsByID,
    deleteExperimentsByID,
    createExperiments,
    runExperiment,
    declareGoal,
}