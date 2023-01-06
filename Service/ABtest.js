const Util = require("./utils");
const {ExperimentStorage} = require('../db/ExperimentStorage');

 function ABcheckAttributes(endUserReq, experiment) {

    const {A, B, C} = experiment.variants_ab;

    if (Util.shouldAllow(experiment.traffic_percentage / 100)) {
        if (Util.checkAttributes(endUserReq, experiment))
            return Util.returnByRatio(A, B);
    }
    return C;
}

module.exports = {
    ABcheckAttributes
}
