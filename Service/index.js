//************* Express Server ************//
const express = require("express");
const {routerExp, routerGoal, variantRouter} = require("./router");
const app = express();
const requestIp = require('request-ip');


const ipMiddleware = function(req, res, next) {
    req.clientIp = requestIp.getClientIp(req);
    next();
};
app.use(ipMiddleware);
app.use(requestIp.mw());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/experiment', routerExp);
app.use('/goal', routerGoal);
app.use('/variant', variantRouter);

app.listen(3000);
console.log(`listening to port 3000`);
