
const {incAttributeReqCount} = require("../repositories/experiment.repository");
const {PropertyNotFound, EntityNotFound} = require("../errors/NotFound.errors");
const {ServerUnableError} = require("../errors/internal.errors");
const {v4: uuidv4, validate: uuidValidator} = require("uuid");
const userRepository = require("../repositories/user.repository");


const getUserByUuid = async (uuid) => {
    if (!uuid) return false;
    const [user] = await userRepository.retrieveByUuid(uuid);
    if (!user) throw new EntityNotFound("user");
    return user;
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
const checkAttributes = (endUserReq, experiment, next) => {
    try {
        const location = endUserReq.testAttributes.location;
        const browser = endUserReq.testAttributes.browser;
        const device = endUserReq.testAttributes.device;
        const customAttributes = endUserReq.customAttributes;
        if (location && browser && device) {
            const defAttResult =
                compareAttributes(experiment.testAttributes.location, endUserReq.testAttributes.location) &&
                compareAttributes(experiment.testAttributes.browser, endUserReq.testAttributes.browser) &&
                compareAttributes(experiment.testAttributes.device, endUserReq.testAttributes.device);
            let attributes = {"location": location, "browser": browser, "device": device};
            let customAttResult;
            if (customAttributes) {
                customAttResult = Object.entries(customAttributes).every(([key, value]) => {
                    return compareAttributes(experiment.customAttributes[key], value)
                })
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
    getLocation,
    getClientIP,
    getBrowserDevice

};
