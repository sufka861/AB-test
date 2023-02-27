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
const app = express();
const { errorHandler } = require("./middleware/errorHandler.mw");
const logPath = path.join(__dirname, "logs", "http.log");
const port = process.env.PORT || 3000;
const { experimentRouter } = require("./router/experiment.router");
const { testRouter } = require("./router/external.routes");
const { userRouter } = require("./router/user.routes");
const statsRouter = require("./router/stats.router");
const {goalRouter} = require("./router/goal.router");
const {experimentStatusUpdate} = require("./Service/cron.job");


// const Logger = require('abtest-logger');
//  const logger = new Logger("amqps://qdniwzza:a-yzSrHM7aPJ-ySEYMc7trjzvs00QJ5b@rattlesnake.rmq.cloudamqp.com/qdniwzza");
//  const loggerMethods = async()=>{
//    await logger.info('inforamtion about the code')
//    await logger.error('errors')
//    await logger.debug('debug purposes')
//  }


experimentStatusUpdate();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  logger(":date --> :method :url :status :response-time ms", {
    stream: fs.createWriteStream(logPath, { flags: "a" }),
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}))
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/test", testRouter);
app.use("/user", userRouter);
app.use("/experiments", experimentRouter);
app.use("/goal", goalRouter);
app.use("/stats", statsRouter);
app.use(errorHandler);


  app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
  });


