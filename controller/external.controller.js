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
  bodyValidator(req);
  if (!req.body.experimentId) throw new MissingPropertyError("experiment id");
  if (!(await checkIfExperimentIsActive(req.body.experimentId)))
    throw new ExperimentNotActive(req.body.experimentId);
  const user = await getUserByUuid(req, res);
  // ---------------------------------------------------------------------  //
  if (user) {
    const experimentsList = getUserExperiment(user, req.body.experimentId);
    if (!experimentsList) {
      const existingVariant = await doExperiment(
        req.body.experimentId,
        user[0].uuid,
        req
      );
      return res.status(200).json(existingVariant);
    }
    if (!req.body.subscription === "premium") {
      experimentsList.forEach((exp) => {
        if (exp.experimentId === req.body.experimentId) {
          return res.status(200).json(exp.variant);
        }
      });
      const newVariant = await doExperiment(
        req.body.experimentId,
        user[0].uuid,
        req
      );
      return res.status(200).json(newVariant);
    }
    return res.status(200).json(experimentsList[0].variant);
  }
  const experiment = await ExperimentRepository.retrieve(req.body.experimentId);
  if (!experiment) throw new EntityNotFound("experiment");
  if (checkAttributes(req, experiment, next)) {
    const newUser = await addUser(req, res);
    res.cookie("uuid", newUser.uuid, { maxAge: 900000, httpOnly: true });
    const variant = await doExperiment(
      req.body.experimentId,
      newUser.uuid,
      req
    );
    res.status(200).json(variant);
  } else {
    res.status(200).json({ message: "user does not match attributes" });
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
