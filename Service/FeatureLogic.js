const Util = require("./utils");
const MongoStorage = require ('../db/MongoStorage');
const {ExperimentStorage} = require('../db/ExperimentStorage')


 function featureCheckAttributes(endUserReq, experiment) {

    if(Util.shouldAllow(experiment.traffic_percentage /100)) {

        const {ON, OFF} = experiment.variants_ff;
        if(Util.checkAttributes(endUserReq, experiment))
            return ON;
        else
            return OFF;
    }
}

module.exports={
    featureCheckAttributes
}
