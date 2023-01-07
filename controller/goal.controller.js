const {ExperimentRepository} = require('../repositories/experiment.repository');
const {PropertyNotFound} = require("../errors/NotFound.errors");
const {ServerUnableError} = require("../errors/internal.errors");
const { bodyValidator } = require("../validators/body.validator");
const { BodyNotSent } = require("../errors/BadRequest.errors");

module.exports = {
    incVariantByExperimentID: async (req, res) => {
        const id = req.params.id;
        const {variant} = req.body;
        if (id && variant)
            res.status(200).send(await ExperimentRepository.incVariantSuccessCount(id, variant));
        else
            throw new PropertyNotFound("incVariantByExperimentID");
    },

    getCallCountByExperimentID: async (req, res) => {
        const id = req.params.id;
        if (id)
            res.status(200).send(await ExperimentRepository.getCallCount(id));
        else
            throw new PropertyNotFound("getCallCountByExperimentID");
    },

    getVariantSuccessCountByExperimentID: async (req, res) => {
        const id = req.params.id;
        if (id)
            res.status(200).send(await ExperimentRepository.getVariantSuccessCount(id));
        else
            throw new PropertyNotFound("getVariantSuccessCountByExperimentID");
    }
}
