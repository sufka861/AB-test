const ExperimentStorage = require("../repositories/experiment.repository");
const ffLogic = require("./feature.logic");
const abLogic = require("./AB.test.logic");
const Util = require("./utils");

const featureFlagExpType = "f-f";

const checkExperimentTypeAndExecExperiment = async (
  experimentID,
  
) => {
  const experiment = await ExperimentStorage.retrieve(experimentID);
  console.log(experiment);
  const { status, type } = experiment;

  if (Util.shouldAllow(experiment.trafficPercentage / 100)) {
    const experimentLogic =
      type === featureFlagExpType
        ? ffLogic.featureCheckAttributes
        : abLogic.ABcheckAttributes;

    await ExperimentStorage.incCallCount(experiment._id);
    return experimentLogic(experiment);
  }
  return type === featureFlagExpType
    ? { OFF: false, tested: false }
    : { C: experiment.variantsAB.C, tested: false };
};

module.exports = {
  checkExperimentTypeAndExecExperiment,
};
