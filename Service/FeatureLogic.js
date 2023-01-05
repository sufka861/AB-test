const Util = require("./utils");
const MongoStorage = require ('../db/MongoStorage');
const experimentDB = new MongoStorage("experiment");


async function featureCheckAttributes(req, experimentID) {
    const exp = await experimentDB.retrieve(experimentID);
    if(Util.shouldAllow(exp.traffic)) {
        const [{A, B}] = exp.variants;
        const geo = Util.getLocation(req);
        const {browser, device} = Util.getBrowserDevice(req);
        if (geo && browser && device) {
            if (geo.country === exp.location && browser === exp.browser && device === exp.device) {
                exp.counter = exp.counter + 1;
                return A;
            }
            return("the attributes in not equal"+ B);
        }
    }
}

module.exports={
    featureCheckAttributes
}