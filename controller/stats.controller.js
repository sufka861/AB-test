const ValidationError = require("../errors/validation.errors");
const NotFoundError = require("../errors/NotFound.errors");
const ServerError = require("../errors/internal.errors");
const ExperimentRepository = require("../repositories/experiment.repository");
const UserRepository = require("../repositories/user.repository");
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

module.exports = {
    getStatistics,
    getUsersStats,
    getTestsPerMonth
}
