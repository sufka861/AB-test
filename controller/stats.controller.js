const ValidationError = require("../errors/validation.errors");
const NotFoundError = require("../errors/NotFound.errors");
const ServerError = require("../errors/internal.errors");
const ExperimentRepository = require("../repositories/experiment.repository");
const UserRepository = require("../repositories/user.repository");
const {mongoose} = require("mongoose");

const userPercentageVariantByExperiment = async (experimentID, variant) => {
    return (await UserRepository.numUsersByExperimentIdAndVariant(experimentID, variant) / await UserRepository.numUsersByExperimentId(experimentID)) * 100;
}

const getStatistics = async (req, res) => {

    const experimentID = req.params.id;
    if (!mongoose.isValidObjectId(experimentID)) throw new ValidationError.MissingPropertyError("experiment ID");

    const experiment = await ExperimentRepository.retrieve(experimentID);
    if (!experiment) throw new NotFoundError.EntityNotFound(`experiment (${experimentID})`);
    if (!experiment.call_count) throw new ServerError.ServerUnableError("calculate experiment call count");
    switch (experiment.type) {
        case "a-b" :
            res.status(200).send({
                A: (experiment.variant_success_count.A / experiment.call_count * 100).toFixed(2),
                B: (experiment.variant_success_count.B / experiment.call_count * 100).toFixed(2),
                C: (experiment.variant_success_count.C / experiment.call_count * 100).toFixed(2),
            });
            break;
        case "f-f":
            res.status(200).send({
                ON: (experiment.variant_success_count.ON / experiment.call_count * 100).toFixed(2),
                OFF: (experiment.variant_success_count.OFF / experiment.call_count * 100).toFixed(2)
            })
            break;
        default:
            throw new ValidationError.InvalidProperty(`experiment type in experiment (${experimentID})`);
    }
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

module.exports = {
    getStatistics,
    getUsersStats
}
