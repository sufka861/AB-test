const { Router } = require("express");
const testRouter = new Router();
const { runTest, reportGoal } = require("../controller/external.controller");

testRouter.post("/run", runTest);
testRouter.put("/report-goal", reportGoal);

module.exports = { testRouter };
