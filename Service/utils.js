const geoip = require("geoip-lite");
const parser = require("ua-parser-js");
const requestIp = require("request-ip");
const { PropertyNotFound } = require("../errors/NotFound.errors");
const { ServerUnableError } = require("../errors/internal.errors");

const getClientIP = (endUserReq) => {
  const result = requestIp.getClientIp(endUserReq);
  if (!result) throw new ServerUnableError("getClientIP");
  return result;
};

const getLocation = (req) => {
  if (!req) throw new PropertyNotFound("getlocation");
  const result = geoip.lookup(req.clientIp);
  if (!result) throw new ServerUnableError("getClientIP");
  return result;
};

const getBrowserDevice = (req) => {
  const userAgentInfo = parser(req.headers["user-agent"]);
  const result = {
    browser: userAgentInfo.browser.name,
    device: userAgentInfo.device.type || "desktop",
  };
  if (!result) throw new ServerUnableError("getBrowserDevice");
  return result;
};

const shouldAllow = (ratio) => ratio >= 1 - Math.random();

const returnByRatio = (optionA, optionB) => {
  return 0.5 < Math.random() ? optionA : optionB;
};

const checkIfActive = (experiment) => experiment.status === "active";

const checkAttributes = (endUserReq, experiment, next) => {
  try {
    const geo = getLocation(getClientIP(endUserReq));
    const { browser, device } = getBrowserDevice(endUserReq);
    if (geo && browser && device) {
      const result =
        geo.country === experiment.location &&
        browser === experiment.browser &&
        device === experiment.device;
      return result;
    } else return false;
  } catch (error) {
    next(error);
  }
};

module.exports = {
  shouldAllow,
  returnByRatio,
  checkAttributes,
  checkIfActive,
};
