const {
  getUserByUuid,
  addUser,
  insertExperiment,
  getUserExperiment,
} = require("./user.controller");
const { incVariantByGoalID } = require("./goal.controller");
const { checkAttributes } = require("./../Service/utils");
const { bodyValidator } = require("./../validators/body.validator");
const ExperimentRepository = require("../repositories/experiment.repository");
const GoalRepository = require("./../repositories/goal.repository");
const {
  MissingPropertyError,
  UserUnknown,
} = require("../errors/validation.errors");
const { EntityNotFound, PropertyNotFound} = require("../errors/NotFound.errors");
const { ExperimentNotActive, BodyNotSent} = require("../errors/BadRequest.errors");
const {
  checkExperimentTypeAndExecExperiment,
} = require("./../Service/route.logic.experiment");
const {ServerUnableError} = require("../errors/internal.errors");

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

const reportGoal = async (req, res) => {
  const { experimentId, goalId } = req.body;
  if (!(await checkIfExperimentIsActive(experimentId)))
    throw new ExperimentNotActive(experimentId);
  const user = await getUserByUuid(req, res);
  if (!user) throw new UserUnknown();
  const experimentsList = getUserExperiment(user);
  for (const exp of experimentsList) {
    if (exp.experimentId.toString() === experimentId) {
      const variant = [...exp.variant.keys()];
      const response = await GoalRepository.incVariantSuccessCount(
        goalId,
        variant[0]
      );
      return res.status(200).json({
        variant_success_count: response.variantSuccessCount,
      });
    }
  }
  return res.status(200).json({
    message: `current user is not a part of experiment: ${experimentId}`,
  });
};

const createExperimentWithGoals = async (req, res) => {
  if (!bodyValidator(req)) throw new BodyNotSent();
  const {experiment, goals} = req.body;
  if (!experiment || !goals) throw new PropertyNotFound("Invalid request body for creating new experiment");
  const newGoals =  await GoalRepository.createMany(goals);
  if(!newGoals) throw new ServerUnableError("creating new goals")
  experiment.goals = newGoals.map(goal => goal._id);
  const newExperiment = await ExperimentRepository.create(experiment);
  if (!newExperiment) throw ServerUnableError("Creating new experiment");
  res.status(200).send(newExperiment);
}

const updateExperimentWithGoalsByExpID = async (req, res) => {
  if (!req.params.experimentId) throw new PropertyNotFound("experimentId");
  const experimentID = req.params.experimentId;
  const {experiment,goals} = req.body;
  if (!experiment || !goals) throw new PropertyNotFound("Invalid request body for editing experiment");
  console.log(goals)
  const updatedGoals = await Promise.all( goals.map(async ({_id, ...updatedGoalData}) => await GoalRepository.update(_id, updatedGoalData)));
  console.log(updatedGoals)
  if(!updatedGoals.every((goal) =>!!goal)) throw new ServerUnableError("updating goals");
  const updatedExperiment = await ExperimentRepository.update(experimentID, experiment)
  if (!updatedExperiment) throw new ServerUnableError("updateExperimentsByID")
  res.status(200).json(updatedExperiment);
}



module.exports = { runTest, reportGoal, createExperimentWithGoals, updateExperimentWithGoalsByExpID};
