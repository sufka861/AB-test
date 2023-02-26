const requestIp = require('request-ip');
const geoip = require("geoip-lite");
const parser = require("ua-parser-js");

const getIp = (endUserReq) => {
    return requestIp.getClientIp(endUserReq)
}

const getLocationCode = (endUserReq) => {
    return geoip.lookup(getIp(endUserReq));
}

const getUserBrowserDevice = (endUserReq) => {
    const userAgentInfo = parser(endUserReq.headers["user-agent"]);
    return {
        browser: userAgentInfo.browser.name,
        device: userAgentInfo.device.type || "desktop",
    };
}

const filterUserAttributes = (endUserReq, endUserCustomAttributes) => {
    return {
        testAttributes: {
            location: getLocationCode(endUserReq),
            ...getUserBrowserDevice(endUserReq)
        },
        customAttributes: endUserCustomAttributes,
        uuid:  endUserReq.cookies.uuid || null
    }
}
