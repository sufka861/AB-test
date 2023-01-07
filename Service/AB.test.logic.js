const Util = require("./utils");
const {ExperimentStorage} = require('../repositories/experiment.repository');

const ABcheckAttributes = (endUserReq, experiment)=>{
    const {A, B, C} = experiment.variants_ab;
        if (Util.checkAttributes(endUserReq, experiment))
            return Util.returnByRatio({"A": A}, {"B": B});
    return {"C" : C};
}

module.exports = {
    ABcheckAttributes
}
