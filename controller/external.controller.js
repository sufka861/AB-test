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
  // const user = await getUserByUuid(req, res);
  // if (user) {
  //   const exp = getUserExperiment(user, req.body.experimentId);
  //   if (exp) {
  //     res.status(200).json(exp.variant);
  //   }
  //   const existingVariant = doExperiment(req.body.experimentId, user.uuid);
  //   res.status(200).json(existingVariant);
  // }

  // if (checkAttributes(req, req.body.experimentId, next)) {
  const newUser = await addUser(req, res);
  res.cookie("uuid", newUser.uuid, { maxAge: 900000, httpOnly: true });
  const variant = await doExperiment(req.body.experimentId, newUser.uuid, req);
  res.status(200).json(variant);
  // }
  // res.status(200).json({ message: "user does not match attributes" });
};

const doExperiment = async (experimentId, uuid, req) => {
  await ExperimentRepository.incCallCount(experimentId);
  let variant = await checkExperimentTypeAndExecExperiment(experimentId, req);
  console.log(variant);
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
