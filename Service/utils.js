const geoip = require('geoip-lite');
const parser = require('ua-parser-js');
const cron = require('node-cron');
const MongoStorage = require ('../db/MongoStorage');
const experimentDB = new MongoStorage("experiment");
const ffLogic = require('./FeatureLogic');
const abLogic = require('./ABtest');
const requestIp = require("request-ip");


function getClientIP(endUserReq){
    return requestIp.getClientIp(endUserReq);
}
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

async function checkType(req, res) {
    res.status(200);
    const experimentID = req.params.id;
    const exp = await experimentDB.retrieve(experimentID);

    const expType = exp.type;
    const expStatus = exp.status;
    if (expStatus === 'Active') {
        if (expType == 'f-f')
            ffLogic.featureCheckAttributes(req, experimentID);
        else
            abLogic.checkAttributes(req, experimentID);
    } else
        res.send("Experiment status:" + expStatus);
}


function checkIfTerminated(req){
    const termineated = req.termineated;
    return termineated;
}

async function cronExperiment(startTime, endTime, ExpID){
    //startTime&endTime - Time in UTC!
    const difTime = endTime.getDate() - startTime.getDate();
    const exp = await experimentDB.retrieve(ExpID);
    const task = cron.schedule(startTime, () =>  {
        const intervalObj = setInterval(() => {
            exp.status = "Active";
            if(checkIfTerminated() == true){
                clearInterval(intervalObj);
            }
          }, difTime);

        clearInterval(intervalObj);
      });
      exp.status = "Ended";
      task.stop();
}

module.exports = {
    getLocation,
    getBrowserDevice,
    shouldAllow,
    getClientIP,
    returnByRatio,
    cronExperiment
}
