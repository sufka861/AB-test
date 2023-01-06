const MongoStorage = require('../db/MongoStorage');
const utils = require("./utils");
const {ExperimentStorage} = require ('../db/ExperimentStorage');

function checkAttributesAndReturnVariant(endUserReq, experimentID) {

    const experiment = ExperimentStorage.retrieve(experimentID)
    const {A, B, C} = experiment.variants;

    if(utils.shouldAllow(experiment.traffic_percentage / 100)) {

        const geo = utils.getLocation(utils.getClientIP(endUserReq));
        const {browser, device} = utils.getBrowserDevice(endUserReq);

        if (geo && browser && device) {
            if (geo.country === experiment.location && browser === experiment.browser && device === experiment.device) {
                return 0.5 < Math.random() ? A : B;
            }
        }
    }
    return C;
}

module.exports = {
    checkAttributesAndReturnVariant
}
