const MongoStorage = require('../db/MongoStorage');
const experimentDB = new MongoStorage("experiment");

async function getAllExperiments(req, res) {
    if (req.query.experiment_id) {
        const experiment_id = req.query.experiment_id;
        res.send(await experimentDB.retrieve(experiment_id));
    } else {
        res.send(await experimentDB.find());
    }
}

async function getExperimentsByAccountId(req, res) {
    if (req.params.account_id) {
        const account_id = req.params.account_id;
        res.send(await experimentDB.findGroup("account_id", account_id));
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


module.exports = {
    getAllExperiments,
    getExperimentsByAccountId,
    getExperimentsAB,
    getExperimentsFF,
    updateExperimentsByID,
    deleteExperimentsByID,
    createExperiments,
}