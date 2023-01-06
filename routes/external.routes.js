const { Router } = require("express");
const testRouter = new Router();
const { runTest } = require("./../controllers/external.controller");

testRouter.post("/run", runTest);

module.exports = { testRouter };
