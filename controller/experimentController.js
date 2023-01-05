const MongoStorage = require ('../db/MongoStorage');
const experimentDB = new MongoStorage("experiment");

async function getAllExperiments(req, res) {
    res.send(await experimentDB.find());
}

async function getExperimentsByID(req, res) {
    const experimentID = req.params._id;
    res.send(await experimentDB.retrieve(experimentID));
}

async function getExperimentsAB(req, res) {
    res.send(await experimentDB.findGroup("type", "a-b"));
}

async function getExperimentsFF(req, res) {
    res.send(await experimentDB.findGroup("type", "f-f"));
}

async function getExperimentsByLocation(req, res) {
    console.log("got here")
    const locationsJSON = req.body;
    const locationsList = locationsJSON.body.json.location;
    console.log(locationsList);
    res.send(await experimentDB.find({}));
}

async function createExperiments(req, res) {
    res.send(await experimentDB.create(req.body));
}

async function updateExperimentsByID(req, res) {
    const experimentID = req.params._id;
    res.send(await experimentDB.update(experimentID, req.body));
}

async function deleteExperimentsByID(req, res) {
    const experimentID = req.params._id;
    res.send(await experimentDB.delete(experimentID));
}


module.exports = {
    getAllExperiments,
    getExperimentsByID,
    getExperimentsAB,
    getExperimentsFF,
    getExperimentsByLocation,
    updateExperimentsByID,
    deleteExperimentsByID,
    createExperiments,
}