const DB = require("./DAL");
const features = require('creature-features')();
const Util = require("./Utils");
const experiments = require("../DB/experiments.json");

function featureCheckAttributes(req, experimentID) {
    if(Util.shouldAllow(experiment.traffic)) {
        const [experiment] = DB.getExperimentByID(experimentID);
        const [{A, B}] = DB.getVariantsByExpID(experimentID);

        const geo = Util.getLocation(req);
        const {browser, device} = Util.getBrowserDevice(req);
        if (geo && browser && device) {
            if (geo.country === experiment.location && browser === experiment.browser && device === experiment.device) {
                experiment.counter = experiment.counter + 1;
                let goals = DB.getGoalsByID(experimentID);
                goals.ON =goals.ON +1;
                res.send(A);
            }
            res.send("the attributes in not equal"+ B);
        }
    }
}

module.exports={
    featureCheckAttributes
}