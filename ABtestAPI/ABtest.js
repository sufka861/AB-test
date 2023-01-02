const geoip = require('geoip-lite');
const parser = require('ua-parser-js');
const {ExperimentStorage} = require ('../db/ExperimentStorage');
const requestIp = require("request-ip");

function getClientIP(endUserReq){
    return requestIp.getClientIp(endUserReq);

}
function getLocation(ip) {
    return  geoip.lookup(ip);
}

function getBrowserDevice(req) {
    const userAgentInfo = parser(req.headers['user-agent']);
    return {
        browser: userAgentInfo.browser.name,
        device: userAgentInfo.device.type ? userAgentInfo.device.type : 'desktop'
    }
}

const shouldAllow = (ratio) => ratio >= 1 - Math.random();

async function checkAttributesAndReturnVariant(endUserReq, experimentID) {

    const experiment = await ExperimentStorage.retrieve(experimentID)

    const {A, B, C} = experiment.variants;

    if(shouldAllow(experiment.traffic_percentage / 100)) {

        const geo = getLocation(getClientIP(endUserReq));
        const {browser, device} = getBrowserDevice(endUserReq);

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
