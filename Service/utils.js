const geoip = require('geoip-lite');
const parser = require('ua-parser-js');
const cron = require('node-cron');
const MongoStorage = require('../db/MongoStorage');
const experimentDB = new MongoStorage("experiment");
const ffLogic = require('./FeatureLogic');
const abLogic = require('./ABtest');
const requestIp = require("request-ip");


function getClientIP(endUserReq) {
    return requestIp.getClientIp(endUserReq);
}

function getLocation(req) {
    return geoip.lookup(req.clientIp);
}

function getBrowserDevice(req) {
    const userAgentInfo = parser(req.headers['user-agent']);
    return {
        browser: userAgentInfo.browser.name,
        device: userAgentInfo.device.type || 'desktop'
    }
}

const shouldAllow = (ratio) => ratio >= 1 - Math.random();

function returnByRatio(optionA, optionB) {
    return 0.5 < Math.random() ? optionA : optionB;
}



function checkIfTerminated(req) {
    const termineated = req.termineated;
    return termineated;
}



function checkAttributes(endUserReq, experiment) {
    const geo = getLocation(getClientIP(endUserReq));
    const {browser, device} = getBrowserDevice(endUserReq);
    if (geo && browser && device)
        return (geo.country === experiment.location && browser === experiment.browser && device === experiment.device)
    else
        return false;
}


module.exports = {
    shouldAllow,
    returnByRatio,
    checkAttributes
}
