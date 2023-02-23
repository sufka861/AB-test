const {Router} = require("express");
const statsController = require("../controller/stats.controller");
const statsRouter = new Router();

statsRouter.get("/userVariant/:id", statsController.getUsersStats)
statsRouter.get('/:id',statsController.getStatistics);
statsRouter.get('/testsPerMonth/:accountId',statsController.getTestsPerMonth);


module.exports = statsRouter;
