const {ExperimentStorage} = require('../db/experiment.storage');


module.exports = {
    incVariantByExperimentID: async (req, res) => {
        const id = req.params.id;
        const {variant} = req.body;
        if (id && variant)
            res.status(200).send(await ExperimentStorage.incVariantSuccessCount(id, variant));
        else
            res.status(404).send(null);
    },

    getCallCountByExperimentID: async (req, res) => {
        const id = req.params.id;
        if (id)
            res.status(200).send(await ExperimentStorage.getCallCount(id));
        else
            res.status(404).send(null);
    },

    getVariantSuccessCountByExperimentID: async (req, res) => {
        const id = req.params.id;
        if (id)
            res.status(200).send(await ExperimentStorage.getVariantSuccessCount(id));
        else
            res.status(404).send(null);
    }

}
