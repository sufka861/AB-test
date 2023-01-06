const express = require('express');
const experimentController = require('../controller/experimentController');
const experimentRouter = new express.Router();

experimentRouter.get('/', experimentController.getAllExperiments);
experimentRouter.get('/AB/:account_id', experimentController.getExperimentsAB);
experimentRouter.get('/FF/:account_id', experimentController.getExperimentsFF);
experimentRouter.get('/:experiment_id', experimentController.getExperimentById);
experimentRouter.get('/account/:account_id', experimentController.getExperimentsByAccountId);
experimentRouter.get('/variant/:experiment_id', experimentController.getVariantByExperimentId);
experimentRouter.get('/date', experimentController.getExperimentsByDate);


experimentRouter.put('/:experiment_id', experimentController.updateExperimentsByID);

experimentRouter.delete('/:experiment_id', experimentController.deleteExperimentsByID);

experimentRouter.post('/', experimentController.createExperiments);
experimentRouter.post('/test/run/:experiment_id', experimentController.runExperiment);
experimentRouter.post('/test/goal/:experiment_id', experimentController.declareGoal);

module.exports = {
    experimentRouter
}