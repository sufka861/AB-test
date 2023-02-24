const { Router } = require("express");
const testRouter = new Router();
const { runTest } = require("../controller/external.controller");

testRouter.post("/test", runTest);

module.exports = { testRouter };
