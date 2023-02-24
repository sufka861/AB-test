const { Router} = require ('express');
const goalController = require('../controller/goal.controller');
const goalRouter = new Router();

goalRouter.get("/:id",goalController.retrieveGoalById);

goalRouter.get("/callCount/:id", goalController.getCallCountByExperimentID);
goalRouter.get("/variantCount/:id", goalController.getVariantSuccessCountByGoalID)
goalRouter.get("/successCount/:id", goalController.geSuccessCountByGoalId);
goalRouter.post("/", goalController.createGoal);

goalRouter.put("/:id", goalController.updateGoal);

goalRouter.put("/variantCount/:id", goalController.incVariantByGoalID);

goalRouter.delete("/:id", goalController.deleteGoal);

module.exports = {goalRouter};

