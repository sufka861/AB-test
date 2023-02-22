const express = require('express');
const experimentController = require('../controller/experiment.controller');
const experimentRouter = new express.Router();

experimentRouter.get('/', experimentController.getAllExperiments);
experimentRouter.get('/AB/:acaccountId', experimentController.getExperimentsAB);
experimentRouter.get('/FF/:acaccountId', experimentController.getExperimentsFF);
experimentRouter.get('/account/:acaccountId', experimentController.getExperimentsByAcaccountId);
experimentRouter.get('/date', experimentController.getExperimentsByDate);
experimentRouter.get('/:experimentId', experimentController.getExperimentById);


experimentRouter.put('/:experimentId', experimentController.updateExperimentsByID);
experimentRouter.put('/:experimentId/:goalId', experimentController.addGoalToExperiment);

experimentRouter.delete('/:experimentId/:goalId', experimentController.removeGoalToExperiment);
experimentRouter.delete('/:experimentId', experimentController.deleteExperimentsByID);

experimentRouter.post('/', experimentController.createExperiments);

module.exports = {
    experimentRouter
}
