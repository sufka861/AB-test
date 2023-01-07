const { Router} = require ('express');
const goalController = require('../controller/goal.controller');
const goalRouter = new Router();

goalRouter.get("callCount/:id", goalController.getCallCountByExperimentID);
goalRouter.get("variantCount/:id", goalController.getVariantSuccessCountByExperimentID)
goalRouter.post("/:id", goalController.incVariantByExperimentID);

