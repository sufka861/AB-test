const {Router} = require("express");
const statsController = require("../controller/stats.controller");
const statsRouter = new Router();

statsRouter.get('/ExperimentsAttributesCount',statsController.getExperimentsAttributesDistribution);
statsRouter.get("/userVariant/:id", statsController.getUsersStats)
statsRouter.get('/reqPerAtt/:experimentId',statsController.getReqPerAttribute);
statsRouter.get('/testsPerMonth/:accountId',statsController.getTestsPerMonth);
statsRouter.get('/variantSuccessCount/:experimentId/:goalId',statsController.getVariantSuccessCount);
statsRouter.get('/ExperimentsCountByDate/:month/:year',statsController.getExperimentsCountByDate);

module.exports = statsRouter;
