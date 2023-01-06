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
const userRouter = require("./routes/user.routes");
const logPath = path.join(__dirname, "logs", "http.log");
const port = process.env.PORT || 3000;
const { testRouter } = require("./routes/external.routes");
const { experimentRouter } = require("./testRouter/experimentRouter");
const { ipMiddleware } = require("./middleware/ip.mw");

// Middleware
app.use(ipMiddleware);
app.use(requestIp.mw());

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
app.use("/user", userRouter);
app.use("/test", testRouter);

// Error middleware
app.use(errorHandler);

// Connection
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
