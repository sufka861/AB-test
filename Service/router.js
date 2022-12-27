const express = require('express');
const controller = require('./controller');
const routerExp = new express.Router();
const routerGoal = new express.Router();
const variantRouter = new express.Router();


routerExp.post('status/:id', controller.setExperimentStatus);
routerExp.get('status/:id', controller.getExperimentStatus);

routerExp.get('/:id', controller.getExperimentByID);

routerGoal.get('/:id', controller.getGoalByExpID);

variantRouter.get('/:id', controller.getVariant);


module.exports = {routerExp, routerGoal, variantRouter}


