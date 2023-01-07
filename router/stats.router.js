const {Router} = require("express");
const statsController = require("../controller/stats.controller");
const statsRouter = new Router();

statsRouter.get('/:id',statsController.getStatistics);

module.exports = statsRouter;
