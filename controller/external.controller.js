const {
  getUserByUuid,
  addUser,
  insertExperiment,
  getUserExperiment,
} = require("./user.controller");
const { checkAttributes } = require("./../Service/utils");
const { bodyValidator } = require("./../validators/body.validator");
const ExperimentRepository = require("../repositories/experiment.repository");
const { MissingPropertyError } = require("../errors/validation.errors");
const { EntityNotFound } = require("../errors/NotFound.errors");
const { ExperimentNotActive } = require("../errors/BadRequest.errors");
const {
  checkExperimentTypeAndExecExperiment,
} = require("./../Service/route.logic.experiment");

const runTest = async (req, res, next) => {
  validateRun(req, req.body.experimentId, req.body.subscription);
  const user = await getUserByUuid(req, res);
  if (user)
    return experimentExistingUser(
      req,
      res,
      user,
      req.body.experimentId,
      req.body.subscription
    );
  return experimentNewUser(req, res, next, req.body.experimentId);
};

const validateRun = async (req, experimentId, subscription) => {
  bodyValidator(req);
  if (!experimentId) throw new MissingPropertyError("experiment id");
  if (!subscription) throw new MissingPropertyError("subscription");
  if (!(await checkIfExperimentIsActive(experimentId)))
    throw new ExperimentNotActive(experimentId);
};

const experimentNewUser = async (req, res, next, experimentId) => {
  const experiment = await ExperimentRepository.retrieve(experimentId);
  if (!experiment) throw new EntityNotFound("experiment");
  if (checkAttributes(req, experiment, next)) {
    const newUser = await addUser(req, res);
    res.cookie("uuid", newUser.uuid, { maxAge: 900000, httpOnly: true });
    const variant = await doExperiment(experimentId, newUser.uuid, req);
    res.status(200).json(variant);
  } else {
    res.status(200).json({ message: "user does not match attributes" });
  }
};

const experimentExistingUser = async (
  req,
  res,
  user,
  experimentId,
  subscription
) => {
  const experimentsList = getUserExperiment(user);
  if (!(subscription === "premium")) {
    for (const exp of experimentsList) {
      if (exp.experimentId.toString() === experimentId) {
        return res.status(200).json(exp.variant);
      }
    }
    const newVariant = await doExperiment(experimentId, user.uuid, req);
    return res.status(200).json(newVariant);
  } else {
    return res.status(200).json(experimentsList[0].variant);
  }
};

const doExperiment = async (experimentId, uuid, req) => {
  await ExperimentRepository.incCallCount(experimentId);
  let variant = await checkExperimentTypeAndExecExperiment(experimentId, req);
  const userExperiment = { experimentId, variant };
  const updatedUser = await insertExperiment(uuid, userExperiment);
  return variant;
};

const checkIfExperimentIsActive = async (experimentId) => {
  const experiment = await ExperimentRepository.retrieve(experimentId);
  if (!experiment) throw new EntityNotFound("experiment");
  if (experiment.status !== "active") return false;
  return true;
};

module.exports = { runTest };
