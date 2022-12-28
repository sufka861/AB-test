const { BodyNotSent } = require("./../errors/BadRequest.errors");
exports.bodyValidator = (req) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0)
    throw new BodyNotSent();
  return true;
};
