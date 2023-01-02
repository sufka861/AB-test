const { Router} = require ('express');
const ABtestController = require('./ABtestController');
const goalRouter = new Router();

goalRouter.post("variant/:id", ABtestController.getVariantByExperimentID);


