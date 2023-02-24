const {Router} = require("express");
const statsController = require("../controller/stats.controller");
const statsRouter = new Router();

statsRouter.get('/ExperimentsAttributesCount',statsController.getExperimentsAttributesDistribution);
statsRouter.get("/userVariant/:id", statsController.getUsersStats)
statsRouter.get('/:id',statsController.getStatistics);
statsRouter.get('/testsPerMonth/:accountId',statsController.getTestsPerMonth);
statsRouter.get('/variantSuccessCount/:experimentId/:goalId',statsController.getVariantSuccessCount);
statsRouter.get('/activeExperiments/:month/:year',statsController.getActiveExperiments);



module.exports = statsRouter;
