const ExperimentRepository = require('../repositories/experiment.repository');
const GoalRepository = require('../repositories/goal.repository')
const {PropertyNotFound} = require("../errors/NotFound.errors");
const {ServerUnableError} = require("../errors/internal.errors");
const {bodyValidator} = require("../validators/body.validator");
const {BodyNotSent} = require("../errors/BadRequest.errors");

module.exports = {
    incVariantByGoalID: async (req, res) => {
        const id = req.params.id;
        const {variant} = req.body;
        if (id && variant)
            res.status(200).send(await GoalRepository.incVariantSuccessCount(id, variant));
        else
            throw new PropertyNotFound("incVariantByExperimentID");
    },

    getCallCountByExperimentID: async (req, res) => {
        const id = req.params.id;
        if (id)
            res.status(200).json({callCount: await ExperimentRepository.getCallCount(id) || 0});
        else
            throw new PropertyNotFound("getCallCountByExperimentID");
    },

    getVariantSuccessCountByGoalID: async (req, res) => {
        const id = req.params.id;
        if (id)
            res.status(200).send(await GoalRepository.getVariantSuccessCount(id));
        else
            throw new PropertyNotFound("getVariantSuccessCountByExperimentID");
    },

    retrieveGoalById: async (req, res) => {
        const id = req.params.id;
        if (id)
            res.status(200).send(await GoalRepository.retrieve(id));
        else
            throw new PropertyNotFound("retrieveGoalById");
    },
    createGoal: async (req,res) => {
        const newGoal = req.body;
        if(newGoal)
            res.status(200).send(await GoalRepository.create(newGoal));
        else
            throw new BodyNotSent("createGoal");
    },
    updateGoal: async (req, res) =>{
        const goalId = req.params.id;
        const newGoal = req.body;

        if(goalId && newGoal)
            res.status(200).send(await GoalRepository.update(goalId, newGoal));
        else
            throw new PropertyNotFound("updateGoal");
    },

    deleteGoal: async (req,res) =>{
        const goalId =  req.params.id;
        if (!goalId) throw new PropertyNotFound("Goal Id in deleteGoal")
        const result = await GoalRepository.delete(goalId);
        if (!result) throw new ServerUnableError(`Deleting goal id: ${goalId}`);
        res.status(200).send(result);
    },
    geSuccessCountByGoalId : async (req,res) =>{
        const goalId =  req.params.id;
        if (!goalId) throw new PropertyNotFound("Goal Id in geSuccessCountByGoalId");
        res.status(200).send(await GoalRepository.getGoalSuccessCountById(goalId));
    },
    incGoalSuccessCount: async (req, res) =>{
        const goalId =  req.params.id;
        if (!goalId) throw new PropertyNotFound("Goal Id in geSuccessCountByGoalId");
        res.status(200).send(await GoalRepository.incGoalSuccessCount(goalId));
    }



}
