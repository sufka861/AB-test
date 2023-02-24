const ValidationError = require("../errors/validation.errors");
const NotFoundError = require("../errors/NotFound.errors");
const ServerError = require("../errors/internal.errors");
const ExperimentRepository = require("../repositories/experiment.repository");
const UserRepository = require("../repositories/user.repository");
const GoalRepository = require("../repositories/goal.repository")
const {mongoose} = require("mongoose");

const userPercentageVariantByExperiment = async (experimentID, variant) => {
    return (await UserRepository.numUsersByExperimentIdAndVariant(experimentID, variant) / await UserRepository.numUsersByExperimentId(experimentID)) * 100;
}

const calculateSuccessPercentage = (successCount, callCount) => {
    return (successCount / callCount * 100).toFixed(2);
}

const getStatistics = async (req, res) => {
    const experimentID = req.params.id;
    if (!mongoose.isValidObjectId(experimentID)) throw new ValidationError.MissingPropertyError("experiment ID");

    const experiment = await ExperimentRepository.retrieve(experimentID);
    if (!experiment) throw new NotFoundError.EntityNotFound(`experiment (${experimentID})`);
    if (!experiment.callCount) throw new ServerError.ServerUnableError("calculate experiment call count");

    let result;
    switch (experiment.type) {
        case "a-b":
            result = {
                A: calculateSuccessPercentage(experiment.variantSuccessCount.A, experiment.callCount),
                B: calculateSuccessPercentage(experiment.variantSuccessCount.B, experiment.callCount),
                C: calculateSuccessPercentage(experiment.variantSuccessCount.C, experiment.callCount),
            };
            break;
        case "f-f":
            result = {
                ON: calculateSuccessPercentage(experiment.variantSuccessCount.ON, experiment.callCount),
                OFF: calculateSuccessPercentage(experiment.variantSuccessCount.OFF, experiment.callCount)
            };
            break;
        default:
            throw new ValidationError.InvalidProperty(`experiment type in experiment (${experimentID})`);
    }

    res.status(200).send(result);
}

const getUsersStats = async (req, res) => {

    const experimentID = req.params.id;
    if (!mongoose.isValidObjectId(experimentID)) throw new ValidationError.MissingPropertyError("experiment ID");
    const experiment = await ExperimentRepository.retrieve(experimentID);
    if (!experiment) throw new NotFoundError.EntityNotFound(`experiment (${experimentID})`);

    switch (experiment.type) {
        case "a-b" :
            res.status(200).send({
                A: userPercentageVariantByExperiment(experimentID, "A"),
                B: userPercentageVariantByExperiment(experimentID, "B"),
                C: userPercentageVariantByExperiment(experimentID, "C")
            });
            break;
        case "f-f":
            res.status(200).send({
                ON: userPercentageVariantByExperiment(experimentID, "ON"),
                OFF: userPercentageVariantByExperiment(experimentID, "OFF")
            })
            break;
        default:
            throw new ValidationError.InvalidProperty(`experiment type in experiment (${experimentID})`);
    }
}

const getReqPerAttribute = async (req, res) => {
    const experimentId = req.params.experimentId;
    if (!mongoose.isValidObjectId(experimentId)) throw new ValidationError.MissingPropertyError("experiment ID");
    const experiment = await ExperimentRepository.retrieve(experimentId);
    if (!experiment) throw new NotFoundError.EntityNotFound(`experiment (${experimentId})`);
    res.status(200).send({
        locations: experiment.test_attributes.location,
        devices: experiment.test_attributes.device,
        browsers: experiment.test_attributes.browser,
    });
}

const getTestsPerMonth = async (req, res) => {

    const accountID = req.params.accountId;
    if (!mongoose.isValidObjectId(accountID)) throw new ValidationError.MissingPropertyError("account ID");
    const results = await ExperimentRepository.getMonthlyCalls(accountID)
    if (!results) {
        throw new ServerError.ServerUnableError("calculate experiment call count");
    } else {
        res.status(200).send({
            tests: results
        })
    }
}

const getVariantSuccessCount = async (req, res) => {

    const goalID = req.params.goalId;
    const experimentID = req.params.experimentId;
    if (!mongoose.isValidObjectId(goalID)) throw new ValidationError.MissingPropertyError("goal ID");
    if (!mongoose.isValidObjectId(experimentID)) throw new ValidationError.MissingPropertyError("experiment ID");
    const result = await GoalRepository.getVariantSuccessCount(goalID);
    const callCount = await ExperimentRepository.getCallCount(experimentID);
    if(callCount === 0)
        callCount = 1;
    if (!result) {
        throw new ServerError.ServerUnableError("calculate variant success count");
    } else {
    console.log(result)
    result.A && (result.A /= callCount);
    result.B && (result.B /= callCount);
    result.C && (result.C /= callCount);
    result.ON && (result.ON /= callCount);
    result.OFF && (result.OFF /= callCount);

        res.status(200).send({
            tests: result
        })
    }
}



module.exports = {
    getStatistics,
    getUsersStats,
    getReqPerAttribute,
    getTestsPerMonth,
    getVariantSuccessCount
}
