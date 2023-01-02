const DB  =  require('./DAL');
const {getGoals} = require("./DAL");
const logic = require('./ABtest');
const featurelogic = require ('./FeatureLogic');

function getExperimentByID(req,res)
{
    const id = req.params.id;
    res.status(200);
    const experiment = DB.getExperiments().filter((exp) => exp.experiment_id == id);
    console.log(experiment);
    res.send(experiment);
}

function getGoalByExpID(req,res)
{
    const id = req.params.id;
    res.status(200);
    const goal = getGoals().filter((goal) => goal.experiment_id == id);
    console.log(goal);
    res.send(goal);


}

function setExperimentStatus(req,res)
{
    res.status(200);
    const id = req.params.id;
    const status = req.body.status;

     let experiments = DB.getExperiments();
     let returnExp;
     experiments.map((exp) =>{
         if (exp.experiment_id == id)
         {
             exp.status = status;
             returnExp = exp;

         }
     })
    console.log(returnExp);
    DB.writeExperiments(experiments);
    res.send(returnExp);

}
// function getVariant(req, res)
// {
//     res.status(200);
//
//     const experimentID = req.params.id;
//
//     const expStatus  = DB.getExperimentByID(experimentID)[0].status;
//
//     if (expStatus === 'Active')
//         res.send(logic.checkAttributes(req, experimentID));
//     else
//         res.send("Experiment status:" + expStatus);
// }
function checkType(req, res) {
    res.status(200);
    const experimentID = req.params.id;
    const expType = DB.getExperimentByID(experimentID)[0].type;
    const expStatus = DB.getExperimentByID(experimentID)[0].status;
    if (expStatus === 'Active') {
        if (expType == 'f-f')
            featurelogic.featureCheckAttributes(req, experimentID);
        else
            logic.checkAttributes(req, experimentID);
    } else
        res.send("Experiment status:" + expStatus);
}

function getExperimentStatus(req,res)
{
    const experimentID = req.params.id;
    res.status(200);
    res.send(DB.getExperimentByID(experimentID).status);
}




module.exports = {
    getExperimentByID,
    getGoalByExpID,
    setExperimentStatus,
    // getVariant,
    getExperimentStatus,
    checkType
}
