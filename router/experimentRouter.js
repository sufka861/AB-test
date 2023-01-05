const express = require('express');
const experimentController = require('../controller/experimentController');
const experimentRouter = new express.Router();

experimentRouter.get('/', experimentController.getAllExperiments);
experimentRouter.get('/AB/:account_id', experimentController.getExperimentsAB);
experimentRouter.get('/FF/:account_id', experimentController.getExperimentsFF);
experimentRouter.get('/account/:account_id', experimentController.getExperimentsByAccountId);

experimentRouter.put('/:experiment_id', experimentController.updateExperimentsByID);

experimentRouter.delete('/:experiment_id', experimentController.deleteExperimentsByID);

experimentRouter.post('/', experimentController.createExperiments);

module.exports = {
    experimentRouter
}