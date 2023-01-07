const Util = require("./utils");
const MongoStorage = require('../db/mongo.storage');


const featureCheckAttributes =(endUserReq, experiment) =>{


    const {ON, OFF} = experiment.variants_ff;
    if (Util.checkAttributes(endUserReq, experiment))
        return {"ON": ON};
    else
        return {"OFF": OFF};s
}

module.exports = {
    featureCheckAttributes
}
