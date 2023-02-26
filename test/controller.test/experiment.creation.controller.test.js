const { expect } = require("chai");
const sinon = require("sinon");
const {createExperimentWithGoals} = require ("../../controller/external.controller");
const ExperimentRepository = require("../../repositories/experiment.repository");
const GoalRepository = require("../../repositories/goal.repository");
const {PropertyNotFound, ServerUnableError, BodyNotSent,} = require("../../errors/internal.errors");

describe("createExperimentWithGoals", () => {

    beforeEach(() => {
        const req = { body: { experiment: {

                },
                goals: [] } };
        const res = {
            status: sinon.stub().returns({
                send: sinon.spy(),
            }),
        };
        next = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should throw an error if no request body is sent", async () => {
        const {experiment, goals} = req.body;
        await createExperimentWithGoals(req, res, next);
        expect(next.calledWithInstanceOf(BodyNotSent)).to.be.true;
    });

    it("should throw an error if experiment or goals properties are missing", async () => {
        req.body = { experiment: {} };
        await createExperimentWithGoals(req, res, next);
        expect(next.calledWithInstanceOf(PropertyNotFound)).to.be.true;
    });

    it("should throw an error if creating goals fails", async () => {
        sinon.stub(GoalRepository, "createMany").resolves(null);
        await createExperimentWithGoals(req, res, next);
        expect(next.calledWithInstanceOf(ServerUnableError)).to.be.true;
    });

    it("should create new goals and a new experiment", async () => {
        const goals = [{ name: "goal 1" }, { name: "goal 2" }];
        const experiment = { name: "experiment 1" };

        sinon.stub(GoalRepository, "createMany").resolves(goals);
        sinon.stub(ExperimentRepository, "create").resolves(experiment);

        await createExperimentWithGoals(req, res, next);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.status().send.calledWith(experiment)).to.be.true;
        expect(res.status().send.calledWith(goals)).to.be.true;

    });
});
