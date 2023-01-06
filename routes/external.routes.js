const { Router } = require("express");
const testRouter = new Router();
const { doTest } = require("./../controllers/external.controller");

testRouter.post("/run", doTest);

module.exports = { testRouter };
