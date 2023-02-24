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
// const { testRouter } = require("./router/external.routes");
const { userRouter } = require("./router/user.routes");
const statsRouter = require("./router/stats.router");
const {goalRouter} = require("./router/goal.router");
const { experimentStatusUpdate } = require("./middleware/cron.job");

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

// this api to test node crone work  
index.use("/testCrone",(req,res,next)=>{
  experimentStatusUpdate(req.body.startTime, req.body.endTime ,true )
  res.send("Test Node cron job ")
})


// make api that terminate the crone  if user want to stop the job
index.post('/terminate',(req,res,next) => {
  experimentStatusUpdate(undefined , undefined,false )
  res.send('Terminate the Job ')
})


// Routes goes here!
// index.use("/test", testRouter);
index.use("/user", userRouter);
index.use("/experiments", experimentRouter);
index.use("/goal", goalRouter);
index.use("/stats", statsRouter);
index.use(errorHandler);

index.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});