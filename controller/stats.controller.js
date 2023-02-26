const ValidationError = require("../errors/validation.errors");
const NotFoundError = require("../errors/NotFound.errors");
const ServerError = require("../errors/internal.errors");
const ExperimentRepository = require("../repositories/experiment.repository");
const UserRepository = require("../repositories/user.repository");
const GoalRepository = require("../repositories/goal.repository")
const {mongoose} = require("mongoose");

const getUsersStats = async (req, res) => {
    const experimentID = req.params.id;
    if (!mongoose.isValidObjectId(experimentID)) throw new ValidationError.MissingPropertyError("experiment ID");
    const result = await UserRepository.getExperimentStats(req.params.id);
    if (!result) throw new NotFoundError.EntityNotFound(`user with experiment (${experimentID})`);
    res.status(200).send({result});
}

const getReqPerAttribute = async (req, res) => {
    const experimentId = req.params.experimentId;
    if (!mongoose.isValidObjectId(experimentId)) throw new ValidationError.MissingPropertyError("experiment ID");
    const experiment = await ExperimentRepository.retrieve(experimentId);
    if (!experiment) throw new NotFoundError.EntityNotFound(`experiment (${experimentId})`);
    res.status(200).send({
        "testAttributes": experiment.testAttributes,
        "customAttributes": experiment.customAttributes
    });
}

const getTestsPerMonth = async (req, res) => {
    const accountID = req.params.accountId;
    if (!mongoose.isValidObjectId(accountID)) throw new ValidationError.MissingPropertyError("account ID");
    const results = await ExperimentRepository.getMonthlyCalls(accountID)
    if (!results) {
        throw new ServerError.ServerUnableError("calculate experiment call count");
    }
    res.status(200).send({
        tests: results
    })
}

const getVariantSuccessCount = async (req, res) => {
    const goalID = req.params.goalId;
    const experimentID = req.params.experimentId;
    if (!mongoose.isValidObjectId(goalID)) throw new ValidationError.MissingPropertyError("goal ID");
    if (!mongoose.isValidObjectId(experimentID)) throw new ValidationError.MissingPropertyError("experiment ID");
    const result = await GoalRepository.getVariantSuccessCount(goalID);
    let callCount = await ExperimentRepository.getCallCount(experimentID);
    if (callCount === 0)
        callCount = 1;
    if (!result) {
        throw new ServerError.ServerUnableError("calculate variant success count");
    }

    result.A && (result.A /= callCount);
    result.B && (result.B /= callCount);
    result.C && (result.C /= callCount);
    result.ON && (result.ON /= callCount);
    result.OFF && (result.OFF /= callCount);

    res.status(200).send({
        tests: result
    })
}

const getExperimentsCountByDate = async (req, res) => {

    const month = req.params.month;
    const year = req.params.year;
    if (month > 12 || month < 1) throw new ValidationError.InvalidProperty("month");
    const inputDate = new Date(year, month - 1, 1);
    const currentDate = new Date();
    if (inputDate > currentDate) throw new ValidationError.InvalidProperty("date can't be in the future");
    const result = await ExperimentRepository.getExperimentsCountByDate(month, year)
    if (result === undefined || result === null) {
        throw new ServerError.ServerUnableError("calculate active experiment by date");
    } else {
        res.status(200).send({
            activeExperiments: result
        })
    }
}

const getExperimentsAttributesDistribution = async (req, res) => {

    const result = await ExperimentRepository.getExperimentCountsByAttributes();
    if (!result) {
        throw new ServerError.ServerUnableError("calculate experiment attribute distribution ");
    } else {
        res.status(200).send({
            attribute_distribution: result
        })
    }
}


module.exports = {
    getUsersStats,
    getReqPerAttribute,
    getTestsPerMonth,
    getVariantSuccessCount,
    getExperimentsCountByDate,
    getExperimentsAttributesDistribution
}
