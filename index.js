require("dotenv").config();
const newrelic = require("newrelic");
require("express-async-errors");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require('body-parser')
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
const index = express();
const requestIp = require("request-ip");
const { errorHandler } = require("./middleware/errorHandler.mw");
const logPath = path.join(__dirname, "logs", "http.log");
const port = process.env.PORT || 3000;
const { experimentRouter } = require("./router/experiment.router");
const { testRouter } = require("./router/external.routes");
const { userRouter } = require("./router/user.routes");
const statsRouter = require("./router/stats.router");
const {goalRouter} = require("./router/goal.router");
const {experimentStatusUpdate} = require("./Service/cron.job");

experimentStatusUpdate();
index.use(express.json());
index.use(express.urlencoded({ extended: true }));
index.use(
  logger(":date --> :method :url :status :response-time ms", {
    stream: fs.createWriteStream(logPath, { flags: "a" }),
  })
);
index.use(cookieParser());
index.use(bodyParser.urlencoded({extended:false}))

index.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Routes goes here!
index.use("/test", testRouter);
index.use("/user", userRouter);
index.use("/experiments", experimentRouter);
index.use("/goal", goalRouter);
index.use("/stats", statsRouter);
index.use(errorHandler);

index.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
