const geoip = require("geoip-lite");
const parser = require("ua-parser-js");
const requestIp = require("request-ip");
const {incReqCount} = require("../repositories/experiment.repository");
const {PropertyNotFound} = require("../errors/NotFound.errors");
const {ServerUnableError} = require("../errors/internal.errors");
const {v4: uuidv4, validate: uuidValidator} = require("uuid");

const getClientIP = (endUserReq) => {
    const result = "176.12.223.44";
    if (!result) throw new ServerUnableError("getClientIP");
    return result;
};

const getLocation = (req) => {
    if (!req) throw new PropertyNotFound("getlocation");
    const result = geoip.lookup(req);
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

const generateUuid = () => {
    return uuidv4();
};

const shouldAllow = (ratio) => ratio >= 1 - Math.random();

const checkIfActive = (experiment) => experiment.status === "active";

const checkAttributes = (endUserReq, experiment, next) => {
    try {
        const geo = getLocation(getClientIP(endUserReq));
        const {browser, device} = getBrowserDevice(endUserReq);
        if (geo && browser && device) {
            const result =
                geo.country === experiment.testAttributes.location[0] &&
                browser === experiment.testAttributes.browser[0] &&
                device === experiment.testAttributes.device[0];
            //GET CUSTOM ATTRIBUTE
            const customAttributes = []
            const attributes = [result, customAttributes]
            const incReq = incReqCount(experiment.experimentId, attributes);
            return result;
        } else return false;
    } catch (error) {
        next(error);
    }
};

module.exports = {
    shouldAllow,
    checkAttributes,
    checkIfActive,
    generateUuid,
};
