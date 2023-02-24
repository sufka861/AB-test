
require("dotenv").config();
const newrelic = require("newrelic");
require("express-async-errors");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
const index = express();
const requestIp = require("request-ip");
const { errorHandler } = require("./middleware/errorHandler.mw");
const logPath = path.join(__dirname, "logs", "http.log");
const port = process.env.PORT || 3000;
// const { experimentRouter } = require("./router/experiment.router");
// const { testRouter } = require("./router/external.routes");
// const { userRouter } = require("./router/user.routes");
// const statsRouter = require("./router/stats.router");
// const {goalRouter} = require("./router/goal.router");
// const { experimentStatusUpdate } = require("./Service/cron.job");


//logger core teamm
const Logger = require('abtest-logger');
//must uncomment line 27
// const abtestlogger = new Logger('amqps://qdniwzza:a-yzSrHM7aPJ-ySEYMc7trjzvs00QJ5b@rattlesnake.rmq.cloudamqp.com/qdniwzza');
console.log(abtestlogger)
const logsFunctions=async() => {

  await logger.info('inforamtion about the code')
//=> info: 19-02-23 02:43:50-> inforamtion about the code

await logger.error('errors')
//=> error: 19-02-23 02:43:50-> errors

await logger.debug('debug purposes')
//=> debug: 19-02-23 02:43:50-> debug purposes

}


index.use(express.json());
index.use(express.urlencoded({ extended: true }));
index.use(
  logger(":date --> :method :url :status :response-time ms", {
    stream: fs.createWriteStream(logPath, { flags: "a" }),
  })
);
index.use(cookieParser());

index.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Routes goes here!

// index.use("/test", testRouter);
// index.use("/user", userRouter);
// index.use("/experiments", experimentRouter);
// index.use("/goal", goalRouter);
// index.use("/stats", statsRouter);
// index.use(errorHandler);

index.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});


