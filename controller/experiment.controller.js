const ExperimentRepository = require("../repositories/experiment.repository");
const { PropertyNotFound } = require("../errors/NotFound.errors");
const { ServerUnableError } = require("../errors/internal.errors");
const { readFile } = require("fs/promises");

const getAllExperiments = async (req, res) => {
  const result = await ExperimentRepository.find();
  if (!result) throw new ServerUnableError("getAllExperiments");
  res.status(200).json(result);
};

const getExperimentById = async (req, res) => {
  if (!req.params.experimentId) throw new PropertyNotFound("experimentId");
  const experimentId = req.params.experimentId;
  const result = await ExperimentRepository.retrieve(experimentId);
  if (!result) throw new ServerUnableError("getExperimentById");
  res.status(200).json(result);
};

const getExperimentsByAccountId = async (req, res) => {
  if (!req.params.accountId) throw new PropertyNotFound("accountId");
  const accountId = req.params.accountId;
  const result = await ExperimentRepository.findByAttribute(
    "accountId",
    accountId
  );
  if (!result) throw new ServerUnableError("getExperimentsByAccountId");
  res.status(200).json(result);
};

const getExperimentsAB = async (req, res) => {
  if (!req.params.accountId) throw new PropertyNotFound("accountId");
  const accountId = req.params.accountId;
  const result = await ExperimentRepository.findByTwoAttributes(
    "type",
    "a-b",
    "accountId",
    accountId
  );
  if (!result) throw new ServerUnableError("getExperimentsAB");
  res.status(200).json(result);
};

const getExperimentsFF = async (req, res) => {
  if (!req.params.accountId) throw new PropertyNotFound("accountId");
  const accountId = req.params.accountId;
  const result = await ExperimentRepository.findByTwoAttributes(
    "type",
    "f-f",
    "accountId",
    accountId
  );
  if (!result) throw new ServerUnableError("getExperimentsFF");
  res.status(200).json(result);
};

const getExperimentsByDate = async (req, res) => {
  if (!req.query.year && req.query.month)
    throw new PropertyNotFound("year and month");
  const year = req.query.year;
  const month = req.query.month;
  const result = await ExperimentRepository.findByDate(year, month);

  const distResult = {
    active: (result.find(obj => obj.status === "active"))?.count || 0,
    ended: (result.find(obj => obj.status === "ended"))?.count || 0,
    terminated: (result.find(obj => obj.status === "terminated"))?.count || 0,
    planned: (result.find(obj => obj.status === "planned"))?.count || 0
  }

    res.status(200).json(distResult);
  }


const deleteExperimentsByID = async (req, res) => {
  if (!req.params.experimentId) throw new PropertyNotFound("experimentId");
  const experimentID = req.params.experimentId;
  const result = await ExperimentRepository.delete(experimentID);
  if (!result) throw new ServerUnableError("deleteExperimentsByID");
  res.status(200).json(result);
};
const addGoalToExperiment = async (req, res) => {
  if (!req.params.experimentId) throw new PropertyNotFound("experimentId");
  if (!req.params.goalId) throw new PropertyNotFound("goalId");
  const result = await ExperimentRepository.addGoal(
    req.params.experimentId,
    req.params.goalId
  );
  if (!result) throw new ServerUnableError("addGoalToExperiment");
  res.status(200).json(result);
};
const terminateExperiment = async (req, res) => {
  if (!req.params.experimentId) throw new PropertyNotFound("experimentId");
  const result = await ExperimentRepository.update(req.params.experimentId, {
    status: "terminated",
  });
  if (!result)
    throw new ServerUnableError("Update experiment status to terminated");
  res.status(200).json({message: 'terminated successfully'})
};
const removeGoalFromExperiment = async (req, res) => {
  if (!req.params.experimentId) throw new PropertyNotFound("experimentId");
  if (!req.params.goalId) throw new PropertyNotFound("goalId");
  const result = await ExperimentRepository.removeGoal(
    req.params.experimentId,
    req.params.goalId
  );
  if (!result) throw new ServerUnableError("removeGoalToExperiment");
  res.status(200).json(result);
};
const allowChangeAttribute = async (req, res) => {
  if (!req.params.accountId) throw new PropertyNotFound("experimentId");
  const experiments = await ExperimentRepository.findByAttribute(
    "accountId",
    req.params.accountId
  );
  if (!experiments) throw new ServerUnableError("getExperimentsByAccountId");
  experiments.forEach((experiment) => {
    if (experiment.status === "active") res.status(200).json(false);
  });
  res.status(200).json(true);
};

const getFeaturesList = async (req, res) => {
  const features = JSON.parse(
    await readFile(__dirname + "/../db/features.list.json", "utf8")
  );
  if (!features) throw new ServerUnableError("getFeaturesList");
  res.status(200).json(features);
};

module.exports = {
  getAllExperiments,
  getExperimentById,
  getExperimentsByAccountId,
  getExperimentsAB,
  getExperimentsFF,
  getExperimentsByDate,
  deleteExperimentsByID,
  addGoalToExperiment,
  removeGoalFromExperiment,
  allowChangeAttribute,
  getFeaturesList,
  terminateExperiment,
};

