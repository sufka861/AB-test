const { Router} = require ('express');
const goalController = require('./goalController');
const goalRouter = new Router();

goalRouter.get("callCount/:id", goalController.getCallCountByExperimentID);
goalRouter.get("variantCount/:id", goalController.getVariantSuccessCountByExperimentID)
goalRouter.post("/:id", goalController.incVariantByExperimentID);

