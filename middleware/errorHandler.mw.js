const logger = require("./../middleware/loggers/error.logger");

exports.errorHandler = (error, req, res, next) => {
  logger.error(error.message);
  res.status(error.status || 500);
  res.json({ message: error.message || "Internal Server Error" });
};
