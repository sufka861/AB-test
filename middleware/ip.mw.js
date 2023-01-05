const requestIp = require("request-ip");
exports.ipMiddleware = function (req, res, next) {
  // middleware for getting clients ip address
  req.clientIp = requestIp.getClientIp(req);
  next();
};
