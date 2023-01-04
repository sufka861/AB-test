const { Router } = require("express");
const MongoStorage = require("../db/MongoStorage");
const experimentRouter = new Router();

const experimentDB = new MongoStorage("experiment");

experimentRouter.get("/", async (req, res) => {
  res.send(await experimentDB.find());
});

experimentRouter.post("/", async (req, res) => {
  console.log(req.body);
  res.send(await experimentDB.create(req.body));
});

module.exports = { experimentRouter };
