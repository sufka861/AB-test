const express = require('express');
const experimentController = require('../controller/experimentController');
const experimentRouter = new express.Router();

experimentRouter.get('/', experimentController.getAllExperiments);

module.exports = {
    experimentRouter
}