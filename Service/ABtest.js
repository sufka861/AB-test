const geoip = require("geoip-lite");
const parser = require("ua-parser-js");
const MongoStorage = require("../db/MongoStorage");

const experimentDB = new MongoStorage("experiment");

function getLocation(req) {
  return geoip.lookup(req.clientIp);
}

function getBrowserDevice(req) {
  const userAgentInfo = parser(req.headers["user-agent"]);
  return {
    browser: userAgentInfo.browser.name,
    device: userAgentInfo.device.type ? userAgentInfo.device.type : "desktop",
  };
}

const shouldAllow = (ratio) => ratio >= 1 - Math.random();

function checkAttributes(req, experimentID) {
  const experiment = experimentDB.retrieve(experimentID);
  const { A, B, C } = experiment.variants;

  if (shouldAllow(experiment.traffic_percentage / 100)) {
    const geo = getLocation(req);
    const { browser, device } = getBrowserDevice(req);
    if (geo && browser && device) {
      if (
        geo.country == experiment.location &&
        browser == experiment.browser &&
        device == experiment.device
      ) {
        return 0.5 < Math.random() ? A : B;
      }
    }
  }
  return C;
}

module.exports = {
  checkAttributes,
};
