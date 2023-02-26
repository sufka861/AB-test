const geoip = require("geoip-lite");
const parser = require("ua-parser-js");
const {incAttributeReqCount} = require("../repositories/experiment.repository");
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

const compareAttributes = (experimentAttributes, userAttribute) => {
    
    return experimentAttributes.reduce((acc, {value})=>{
        acc.push(value);
        return acc;
    }, []).includes(userAttribute);
}
const checkAttributes = (testAttributes, customAttributes, experiment, next) => {
    try {
        const location = testAttributes.location;
        const browser = testAttributes.browser;
        const device = testAttributes.device;
        // const customAttributes = customAttributes;
        if (location && browser && device) {
            const defAttResult =
                compareAttributes(experiment.testAttributes.location, testAttributes.location) &&
                compareAttributes(experiment.testAttributes.browser, testAttributes.browser) &&
                compareAttributes(experiment.testAttributes.device, testAttributes.device);
            
            let attributes = {"location": location, "browser": browser, "device": device};
            let customAttResult;
            if (customAttributes) {
                customAttResult = Object.entries(customAttributes).every(([key, value]) => {
                    return compareAttributes(experiment.customAttributes.get(key), value);
                });
                
                attributes = {...attributes, ...customAttributes};
            }
            const attReqCountResult = incAttributeReqCount(experiment.experimentId, attributes);
            if (!attReqCountResult) throw new ServerUnableError("attReqCountResult");
            return (customAttributes ? (defAttResult && customAttResult) : defAttResult);
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
