require("dotenv").config();
require("express-async-errors");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  logger(":date --> :method :url :status :response-time ms", {
    stream: fs.createWriteStream(logPath, { flags: "a" }),
  })
);
app.use(cookieParser());
app.use(cors());

// Routes goes here!
app.use("/test", testRouter);
app.use("/user", userRouter);
app.use("/experiments", experimentRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
