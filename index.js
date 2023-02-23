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
const requestIp = require("request-ip");
const { errorHandler } = require("./middleware/errorHandler.mw");
const logPath = path.join(__dirname, "logs", "http.log");
const port = process.env.PORT || 3000;
const { experimentRouter } = require("./router/experiment.router");
const { testRouter } = require("./router/external.routes");
const { userRouter } = require("./router/user.routes");
const statsRouter = require("./router/stats.router");
const {goalRouter} = require("./router/goal.router");
const { experimentStatusUpdate } = require("./middleware/cron.job");

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

// this api to test node cron work  // 
app.use("/testCrone",(req,res,next)=>{
  console.log( req.body.experimentId)
  experimentStatusUpdate(req.body.startTime, req.body.endTime ,true , req.body.experimentId)
  res.send("Test Node crone ")
})


//  api that terminate the cron job  if user want to stop 
app.post('/terminate',(req,res,next) => {
  console.log( req.body.experimentId)
  experimentStatusUpdate(undefined , undefined,false , req.body.experimentId)
  res.send('Terminate the Job ')
})


// Routes goes here!
app.use("/test", testRouter);
app.use("/user", userRouter);
app.use("/experiments", experimentRouter);
app.use("/goal", goalRouter);
app.use("/stats", statsRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is listening on port${port}...`);
});