const {json} = require("express");
const ExperimentRepository = require("../repositories/experiment.repository");
const {PropertyNotFound} = require("../errors/NotFound.errors");
const {ServerUnableError} = require("../errors/internal.errors");
const { bodyValidator } = require("../validators/body.validator");
const { BodyNotSent } = require("../errors/BadRequest.errors");
const experimentRepository = new ExperimentRepository();

const getAllExperiments = async (req, res) => {
    const result = await experimentRepository.find();
    if (!result) throw new ServerUnableError("getAllExperiments")
    res.status(200).json({result});
}

const getExperimentById = async (req, res) => {
    if (!req.params.experiment_id) throw new PropertyNotFound("experiment_id");
    const experiment_id = req.params.experiment_id;
    const result = await experimentRepository.retrieve(experiment_id);
    if (!result) throw new ServerUnableError("getExperimentById")
    res.status(200).json({result});
}

const getExperimentsByAccountId = async (req, res) => {
    if (!req.params.account_id) throw new PropertyNotFound("account_id");
    const account_id = req.params.account_id;
    const result = await experimentRepository.findByAttribute("account_id", account_id);
    if (!result) throw new ServerUnableError("getExperimentsByAccountId")
    res.status(200).json({result});
}

const getExperimentsAB = async (req, res) => {
    if (!req.params.account_id) throw new PropertyNotFound("account_id");
    const account_id = req.params.account_id;
    const result = await experimentRepository.findByTwoAttributes("type", "a-b", "account_id", account_id);
    if (!result) throw new ServerUnableError("getExperimentsAB")
    res.status(200).json({result});

}

const getExperimentsFF = async (req, res) => {
    if (!req.params.account_id) throw new PropertyNotFound("account_id");
    const account_id = req.params.account_id;
    const result = await experimentRepository.findByTwoAttributes("type", "f-f", "account_id", account_id);
    if (!result) throw new ServerUnableError("getExperimentsFF")
    res.status(200).json({result});

}

const getExperimentsByDate = async (req, res) => {
    if (!req.query.year && req.query.month) throw new PropertyNotFound("year and month");
    const year = req.query.year;
    const month = req.query.month;
    const result = await experimentRepository.findByDate(year, month);
    if (!result) throw new ServerUnableError("getExperimentsByDate")
    res.status(200).json({result});
}

const createExperiments = async (req, res) => {
    if(!bodyValidator(req)) throw new BodyNotSent();
    const result = await experimentRepository.create(req.body)
    if (!result) throw new ServerUnableError("createExperiments")
    res.status(200).json({result});
}

const updateExperimentsByID = async (req, res) => {
    if (!req.params.experiment_id) throw new PropertyNotFound("experiment_id");
    const experimentID = req.params.experiment_id;
    const result = await experimentRepository.update(experimentID, req.body)
    if (!result) throw new ServerUnableError("updateExperimentsByID")
    res.status(200).json({result});
}

const deleteExperimentsByID = async (req, res) => {
    if (!req.params.experiment_id) throw new PropertyNotFound("experiment_id");
    const experimentID = req.params.experiment_id;
    const result = await experimentRepository.delete(experimentID)
    if (!result) throw new ServerUnableError("deleteExperimentsByID")
    res.status(200).json({result});
}

const getExperimentGoalReach = async (req, res) => {
    if (req.params.experiment_id) {
        const experiment_id = req.params.experiment_id;
        const experiment = await experimentRepository.retrieve(experiment_id);
        const calls_number = experiment.call_count;
        const A_variant_name = experiment.variants.A;
        const B_variant_name = experiment.variants.B;
        let A_statistic = 0;
        let B_statistic = 0;
        if(calls_number > 0) {
            const A = experiment.variant_success_count[0];
            A_statistic = (A / calls_number) * 100;
            const B = experiment.variant_success_count[1];
            B_statistic = (B / calls_number) * 100;
        }
        const result = {
            "goals":[
                {
                    "variant": `${A_variant_name}`,
                    "goal_reach": `${A_statistic}%`
                },
                {
                    "variant": `${B_variant_name}`,
                    "goal_reach": `${B_statistic}%`
                }
            ]
        }
        res.status(200).json({ result });
    }
}

const getExperimentVariantExposure = async (req, res) => {
    if (req.params.experiment_id) {
        const experiment_id = req.params.experiment_id;
        const experiment = await experimentRepository.retrieve(experiment_id);
        const calls_number = experiment.call_count;
        const A_variant_name = experiment.variants.A;
        const B_variant_name = experiment.variants.B;
        let A_statistic = 0;
        let B_statistic = 0;
        if(calls_number > 0) {
            const A = experiment.variant_success_count[0];
            A_statistic = (A / calls_number) * 100;
            const B = experiment.variant_success_count[1];
            B_statistic = (B / calls_number) * 100;
        }
        const result = {
            "goals":[
                {
                    "variant": `${A_variant_name}`,
                    "goal_reach": `${A_statistic}%`
                },
                {
                    "variant": `${B_variant_name}`,
                    "goal_reach": `${B_statistic}%`
                }
            ]
        }
        res.status(200).json({ result });
    }
}


module.exports = {
    getAllExperiments,
    getExperimentById,
    getExperimentsByAccountId,
    getExperimentsAB,
    getExperimentsFF,
    getExperimentsByDate,
    updateExperimentsByID,
    deleteExperimentsByID,
    createExperiments,
    getExperimentGoalReach,
}