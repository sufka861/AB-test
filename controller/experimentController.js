const MongoStorage = require ('../db/MongoStorage');
const experimentDB = new MongoStorage("experiment");

async function getAllExperiments(req, res) {
    res.send(await experimentDB.find());
}

module.exports = {
    getAllExperiments
}