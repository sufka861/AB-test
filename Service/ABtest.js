const MongoStorage = require('../db/MongoStorage');
const utils = require("./utils");
const experimentDB= new MongoStorage("experiment");

function checkAttributes(req, experimentID) {

    const experiment = experimentDB.retrieve(experimentID)
    const {A, B, C} = experiment.variants;

    if(utils.shouldAllow(experiment.traffic_percentage / 100)) {
        const geo = utils.getLocation(req);
        const {browser, device} = utils.getBrowserDevice(req);
        if (geo && browser && device) {
            if (geo.country == experiment.location && browser == experiment.browser && device == experiment.device) {
                return 0.5 < Math.random() ? A : B;
            }
        }
    }
    return C;
}

module.exports = {
    checkAttributes
}
