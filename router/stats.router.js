const {Router} = require("express");
const statsController = require("../controller/stats.controller");
const statsRouter = new Router();

statsRouter.get("/userVariant/:id", statsController.getUsersStats)
statsRouter.get('/:id',statsController.getStatistics);


module.exports = statsRouter;
