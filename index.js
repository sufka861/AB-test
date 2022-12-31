require("dotenv").config();
require("express-async-errors");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();

const { errorHandler } = require("./middleware/errorHandler.mw");
const logPath = path.join(__dirname, "logs", "http.log");
const port = process.env.PORT || 3000;
const requestIp = require('request-ip');



// Middleware
const ipMiddleware = function(req, res, next) { // middleware for getting clients ip address
    req.clientIp = requestIp.getClientIp(req);
    next();
};
app.use(ipMiddleware);
app.use(requestIp.mw());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  logger(":date --> :method :url :status :response-time ms", {
    stream: fs.createWriteStream(logPath, { flags: "a" }),
  })
);
app.use(cors());

// Routes goes here!
// app.use()...

// Error middleware
app.use(errorHandler);

// Connection
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
