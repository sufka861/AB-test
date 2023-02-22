const ExperimentStorage = require("../repositories/experiment.repository");
const ffLogic = require("./feature.logic");
const abLogic = require("./AB.test.logic");
const Util = require("./utils");

const featureFlagExpType = "f-f";


const checkExperimentTypeAndExecExperiment = async (
  experimentID,
  endUserReq
) => {
  const experiment = await ExperimentStorage.retrieve(experimentID);
  const { status, type } = experiment;

  if (Util.shouldAllow(experiment.traffic_percentage / 100)) {
    const experimentLogic =
      type === featureFlagExpType
        ? ffLogic.featureCheckAttributes
        : abLogic.ABcheckAttributes;

    await ExperimentStorage.incCallCount(experiment._id);
    return experimentLogic(endUserReq, experiment);
  }
  return type ===featureFlagExpType ? { OFF: false } : { C: experiment.variants_ab.C };
};

module.exports = {
  checkExperimentTypeAndExecExperiment,
};
