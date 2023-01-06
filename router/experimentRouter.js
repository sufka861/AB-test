const express = require('express');
const experimentController = require('../controller/experimentController');
const experimentRouter = new express.Router();

experimentRouter.get('/', experimentController.getAllExperiments);
experimentRouter.get('/AB', experimentController.getExperimentsAB);
experimentRouter.get('/FF', experimentController.getExperimentsFF);
experimentRouter.get('/:_id', experimentController.getExperimentsByID);

experimentRouter.put('/:_id', experimentController.updateExperimentsByID);

experimentRouter.delete('/:_id', experimentController.deleteExperimentsByID);

experimentRouter.post('/', experimentController.createExperiments);

module.exports = {
    experimentRouter
}