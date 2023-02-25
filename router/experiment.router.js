const express = require('express');

const experimentController = require('../controller/experiment.controller');
const externalController = require('../controller/external.controller')
const experimentRouter = new express.Router();

experimentRouter.get('/', experimentController.getAllExperiments);
experimentRouter.get('/AB/:accountId', experimentController.getExperimentsAB);
experimentRouter.get('/FF/:accountId', experimentController.getExperimentsFF);
experimentRouter.get('/account/:accountId', experimentController.getExperimentsByAccountId);
experimentRouter.get('/date', experimentController.getExperimentsByDate);
experimentRouter.get("/allowChangeAttribute/:accountId", experimentController.allowChangeAttribute);
experimentRouter.get('/features', experimentController.getFeaturesList);
experimentRouter.get('/:experimentId', experimentController.getExperimentById);
experimentRouter.get("/features", experimentController.getFeaturesList);
experimentRouter.put("/terminate/:experimentId", experimentController.terminateExperiment);
experimentRouter.put("/:experimentId/:goalId", experimentController.addGoalToExperiment);
experimentRouter.put('/:experimentId', externalController.updateExperimentWithGoalsByExpID);
experimentRouter.post('/new', externalController.createExperimentWithGoals);
experimentRouter.delete("/:experimentId/:goalId", experimentController.removeGoalFromExperiment);
experimentRouter.delete("/:experimentId", experimentController.deleteExperimentsByID);

module.exports = {
    experimentRouter
}
