const assert = require("chai").assert;
const sinon = require("sinon");
const ExperimentStorage = require("../../repositories/experiment.repository");
const ffLogic = require("../../Service/feature.logic");
const abLogic = require("../../Service/AB.test.logic");
const Util = require("../../Service/utils");
const { checkExperimentTypeAndExecExperiment } = require("../../Service/route.logic.experiment");


describe("checkExperimentTypeAndExecExperiment", function () {
    beforeEach(function () {
        sinon.stub(ExperimentStorage, "retrieve");
        sinon.stub(ExperimentStorage, "incCallCount");
    });

    afterEach(function () {
        sinon.restore();
    });

    it("should return OFF for a feature flag experiment with traffic percentage of 0%", async function () {
        const experiment = {
            _id: "1020",
            status: "active",
            type: "f-f",
            trafficPercentage: 0,
        };
        ExperimentStorage.retrieve.resolves(experiment);

        // Act
        const result = await checkExperimentTypeAndExecExperiment(
            "1020",
            { userId: "3040" }
        );

        assert.deepEqual(result, { OFF: false });
        sinon.assert.notCalled(ExperimentStorage.incCallCount);
    });

    it("should return C for an A/B test experiment with traffic percentage of 0%", async function () {
        const experiment = {
            _id: "5040",
            status: "active",
            type: "a-b",
            trafficPercentage: 0,
            variantsAB: {
                A: {},
                B: {},
                C: {},
            },
        };
        ExperimentStorage.retrieve.resolves(experiment);

        // Act
        const result = await checkExperimentTypeAndExecExperiment(
            "5040",
            { userId: "3040" }
        );

        assert.deepEqual(result, { C: {} });
        sinon.assert.notCalled(ExperimentStorage.incCallCount);
    });

    it("should return OFF for a feature flag experiment with traffic percentage of 100%", async function () {
        const experiment = {
            _id: "6666",
            status: "active",
            type: "f-f",
            trafficPercentage: 100,
        };
        ExperimentStorage.retrieve.resolves(experiment);
        sinon.stub(Util, "shouldAllow").returns(true);
        sinon.stub(ffLogic, "featureCheckAttributes").returns({});

        const result = await checkExperimentTypeAndExecExperiment("6666", { userId: "3040" });
        assert.deepEqual(result, {});
        sinon.assert.calledOnceWithExactly(ExperimentStorage.incCallCount, "6666");
        sinon.assert.calledOnceWithExactly(ffLogic.featureCheckAttributes, { userId: "3040" }, experiment
        );
    });

    it("should return variant A for an A/B test experiment with traffic percentage of 100%", async function () {
        const experiment = {
            _id: "4567",
            status: "active",
            type: "a-b",
            trafficPercentage: 100,
            variantsAB: {
                A: {},
                B: {},
                C: {},
            },

        };
        ExperimentStorage.retrieve.resolves(experiment);
        sinon.stub(Util, "shouldAllow").returns(true);
        sinon.stub(abLogic, "ABcheckAttributes").returns({});

        const result = await checkExperimentTypeAndExecExperiment(
            "4567",
            { userId: "3040" }
        );

        assert.deepEqual(result, {});
        sinon.assert.calledOnceWithExactly(ExperimentStorage.incCallCount, "4567");
        sinon.assert.calledOnceWithExactly(abLogic.ABcheckAttributes, { userId: "3040" }, experiment
        );
    });
});