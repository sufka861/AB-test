const DB = require('./DAL');
const geoip = require('geoip-lite');
const parser = require('ua-parser-js');


function getLocation(req) {
    // return  geoip.lookup(`${req.clientIp}`);
    return  geoip.lookup(req.clientIp);
}

function getBrowserDevice(req) {
    const userAgentInfo = parser(req.headers['user-agent']);
    return {
        browser: userAgentInfo.browser.name,
        device: userAgentInfo.device.type ? userAgentInfo.device.type : 'desktop'
    }
}

const shouldAllow = (ratio) => ratio >= 1 - Math.random();

function checkAttributes(req, experimentID) {

    const experiment =  DB.getExperimentByID(experimentID)[0];
    const {A, B, C} =  DB.getVariantsByExpID(experimentID)[0];

    if(shouldAllow(experiment.traffic)) {

        const geo = getLocation(req);
        const {browser, device} = getBrowserDevice(req);
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
