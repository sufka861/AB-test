const DB = require("./DAL");
const geoip = require('geoip-lite');
const parser = require('ua-parser-js');


function getLocation(req) {
    return  geoip.lookup(req.clientIp);
}

function getBrowserDevice(req) {
    const userAgentInfo = parser(req.headers['user-agent']);
    return {
        browser: userAgentInfo.browser.name,
        device: userAgentInfo.device.type || 'desktop'
    }
}

const shouldAllow = (ratio) => ratio >= 1 - Math.random();

function returnByRatio( optionA, optionB){
    return 0.5 < Math.random() ? optionA : optionB;
}


module.exports = {
    getLocation,
    getBrowserDevice,
    shouldAllow,
    returnByRatio
}

