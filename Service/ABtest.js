const DB = require('./DAL');
const Util = require ("./Utils");


 function checkAttributes(req, experimentID) {

    const [experiment] =  DB.getExperimentByID(experimentID);
    const [{A, B, C}] =  DB.getVariantsByExpID(experimentID);

    if(Util.shouldAllow(experiment.traffic)) {

        const geo = Util.getLocation(req);
        const {browser, device} = Util.getBrowserDevice(req);
        if (geo && browser && device) {

            if (geo.country === experiment.location && browser === experiment.browser && device === experiment.device) {
                return 0.5 < Math.random() ? A : B;
            }
        }
    }
        return C;
}

module.exports = {
    checkAttributes
}
