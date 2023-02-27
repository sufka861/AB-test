const {
  addUser,
  insertExperiment,
  getUserExperiment,
} = require("./user.controller");
const { checkAttributes, getUserByUuid } = require("./../Service/utils");
const { bodyValidator } = require("./../validators/body.validator");
const ExperimentRepository = require("../repositories/experiment.repository");
const UsersRepository = require('../repositories/user.repository')
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
  validateRun(req, next);
  const user = await getUserByUuid(req.body.uuid);
  if (user){
    return experimentExistingUser(
      res,
      user,
      req.body.experimentId,
      req.body.subscription,
      req.body.inclusive
    );
  } else {
    return experimentNewUser(req, res, next, req.body.experimentId);
  }
};

const validateRun = async (req, next) => {
  try {
    bodyValidator(req);
  if (!req.body.experimentId) throw new MissingPropertyError("experimentId");
  if(!req.body.testAttributes) throw new MissingPropertyError("test attributes")
  if (!(await checkIfExperimentIsActive(req.body.experimentId)))
    throw new ExperimentNotActive(req.body.experimentId);
  } catch (error) {
    next(error)
  }
  
};

const experimentNewUser = async (req, res, next, experimentId) => {
  try {
    const experiment = await ExperimentRepository.retrieve(experimentId);
    if (!experiment) throw new EntityNotFound("experiment");
    if (checkAttributes(req.body.testAttributes, req.body.customAttributes, experiment, next)) {
      const newUser = await addUser(next);
      res.cookie("uuid", newUser.uuid, { maxAge: 900000, httpOnly: true });
      const variant = await doExperiment(experimentId, newUser.uuid);
      res.status(200).json(variant);
    } 
    else {
      res.status(200).json({ message: "user does not match attributes" });
    }
  } catch (error) {
    next(error);
  }
  
};

const experimentExistingUser = async (
  res,
  user,
  experimentId,
  inclusive
) => {
  const experimentsList = getUserExperiment(user);
  if (inclusive) {
    for (const exp of experimentsList) {
      if (exp.experimentId.toString() === experimentId) {
        return res.status(200).json(exp.variant);
      }
    }
    const newVariant = await doExperiment(experimentId, user.uuid);
    return res.status(200).json(newVariant);
  } else {
    return res.status(200).json(experimentsList[0].variant);
  }
};

const doExperiment = async (experimentId, uuid) => {
  await ExperimentRepository.incCallCount(experimentId);
  let variant = await checkExperimentTypeAndExecExperiment(experimentId);
  const userExperiment = { experimentId, variant };
  const updatedUser = await insertExperiment(uuid, userExperiment);
  if(!updatedUser) throw new ServerUnableError('insert experiment to user')
  return variant;
};

const checkIfExperimentIsActive = async (experimentId) => {
    const experiment = await ExperimentRepository.retrieve(experimentId);
  if (!experiment) throw new EntityNotFound("experiment");
  return experiment.status === "active";

};

const reportGoal = async (req, res) => {
  const { experimentId, goalId, uuid} = req.body;
  if (!(await checkIfExperimentIsActive(experimentId)))
    throw new ExperimentNotActive(experimentId);
  const [user] = await UsersRepository.retrieveByUuid(uuid);
  if (!user) throw new UserUnknown();
  const {variant} = user.experiments.find((exp) => exp.experimentId.toString() === experimentId )
  if (!variant)  throw new ServerUnableError(`couldn't load experiment ${experimentId} from user`)
  const response = await GoalRepository.incVariantSuccessCount(goalId, variant.keys().next().value);
  res.status(200).send(response.variantSuccessCount);

};

const createExperimentWithGoals = async (req, res) => {
  if (!bodyValidator(req)) throw new BodyNotSent();
  const {experiment, goals} = req.body;
  if (!experiment || !goals) throw new PropertyNotFound("Invalid request body for creating new experiment");
  const newGoals =  await GoalRepository.createMany(goals);
  if(!newGoals) throw new ServerUnableError("creating new goals")
  experiment.duration.startTime = new Date(experiment.duration.startTime);
  experiment.duration.endTime = new Date(experiment.duration.endTime);
  experiment.goals = newGoals.map(goal => goal._id);
  const newExperiment = await ExperimentRepository.create(experiment);
  if (!newExperiment) throw ServerUnableError("Creating new experiment");
  res.status(200).send(newExperiment);
}

const updateExperimentWithGoalsByExpID = async (req, res) => {
    if (!req.params.experimentId) throw new PropertyNotFound("experimentId");
    const experimentID = req.params.experimentId;
    let updatedExperiment;
    const {experiment, goals} = req.body;
    if (goals) {
        const updatedGoals = await Promise.all(goals.map(async ({
                                                                    _id,
                                                                    ...updatedGoalData
                                                                }) => await GoalRepository.update(_id, updatedGoalData)));
        if (!updatedGoals.every((goal) => !!goal)) throw new ServerUnableError("updating goals");
    }
    if (experiment) {
        updatedExperiment = await ExperimentRepository.update(experimentID, experiment)
        if (!updatedExperiment) throw new ServerUnableError("updateExperimentsByID")
    }
    else updatedExperiment = await ExperimentRepository.retrieve(experimentID)
    res.status(200).json( updatedExperiment );
}



module.exports = { runTest, reportGoal, createExperimentWithGoals, updateExperimentWithGoalsByExpID};
