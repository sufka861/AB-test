const { Router} = require ('express');
const goalController = require('../controller/goal.controller');
const goalRouter = new Router();

goalRouter.get("/", goalController.getAllGoals);
goalRouter.get("/:id",goalController.retrieveGoalById);

goalRouter.get("/callCount/:id", goalController.getCallCountByExperimentID);
goalRouter.get("/variantCount/:id", goalController.getVariantSuccessCountByExperimentID)
goalRouter.get("/successCount/:id", goalController.geSuccessCountByGoalId);
goalRouter.post("/", goalController.createGoal);

goalRouter.put("/:id", goalController.updateGoal);

goalRouter.put("/variantCount/:id", goalController.incVariantByExperimentID);
goalRouter.put('/incSuccessCount/:id', goalController.incGoalSuccessCount);
goalRouter.delete("/:id", goalController.deleteGoal);

module.exports = {goalRouter};
