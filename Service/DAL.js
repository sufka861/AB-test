const fs = require('fs');
const experiments = require("../DB/experiments.json");

function getExperiments() {
    return require('../DB/experiments.json');
}

function getExperimentByID(expID) {
    const experiments = require('../DB/experiments.json');
    return experiments.filter((exp) => exp.experiment_id == expID);
}

function getGoals() {
    return require('../DB/goal.json');
}
function getGoalsByID(GoalID) {
    const experiments = require('../DB/goal.json');
    return experiments.filter((exp) => exp.experiment_id == expID);

}


function writeExperiments(experiments) {

    fs.writeFile('../DB/experiments.json', experiments.toString(), (err) => {
        if (err)
            console.log('write to file failed')
    });

}

function getVariantsByExpID(expID) {
    const variants = require('../DB/varients.json')
    return variants.filter((variant) => variant.experiment_id == expID);
}

module.exports = {
    getExperiments,
    getGoals,
    writeExperiments,
    getVariantsByExpID,
    getExperimentByID,
    getGoalsByID
}
