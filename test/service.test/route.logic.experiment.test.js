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
        // Arrange
        const experiment = {
            _id: "test-experiment-id",
            status: "running",
            type: "f-f",
            trafficPercentage: 0,
        };
        ExperimentStorage.retrieve.resolves(experiment);

        // Act
        const result = await checkExperimentTypeAndExecExperiment(
            "test-experiment-id",
            { userId: "test-user-id" }
        );

        // Assert
        assert.deepEqual(result, { OFF: false });
        sinon.assert.notCalled(ExperimentStorage.incCallCount);
    });

    it("should return C for an A/B test experiment with traffic percentage of 0%", async function () {
        // Arrange
        const experiment = {
            _id: "test-experiment-id",
            status: "running",
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
            "test-experiment-id",
            { userId: "test-user-id" }
        );

        // Assert
        assert.deepEqual(result, { C: {} });
        sinon.assert.notCalled(ExperimentStorage.incCallCount);
    });

    it("should return OFF for a feature flag experiment with traffic percentage of 100%", async function () {
        // Arrange
        const experiment = {
            _id: "test-experiment-id",
            status: "running",
            type: "f-f",
            trafficPercentage: 100,
        };
        ExperimentStorage.retrieve.resolves(experiment);
        sinon.stub(Util, "shouldAllow").returns(true);
        sinon.stub(ffLogic, "featureCheckAttributes").returns({});

        // Act
        const result = await checkExperimentTypeAndExecExperiment(
            "test-experiment-id",
            { userId: "test-user-id" }
        );

        // Assert
        assert.deepEqual(result, {});
        sinon.assert.calledOnceWithExactly(
            ExperimentStorage.incCallCount,
            "test-experiment-id"
        );
        sinon.assert.calledOnceWithExactly(
            ffLogic.featureCheckAttributes,
            { userId: "test-user-id" },
            experiment
        );
    });

    it("should return variant A for an A/B test experiment with traffic percentage of 100%", async function () {
        // Arrange
        const experiment = {
            _id: "test-experiment-id",
            status: "running",
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

        // Act
    //     const result = await checkExperiment
    //     "test-experiment-id",
    //         { userId: "test-user-id" }
    // );

// Assert
        assert.deepEqual(result, {});
        sinon.assert.calledOnceWithExactly(
            ExperimentStorage.incCallCount,
            "test-experiment-id"
        );
        sinon.assert.calledOnceWithExactly(
            abLogic.ABcheckAttributes,
            { userId: "test-user-id" },
            experiment
        );
// Act
        const result = await checkExperimentTypeAndExecExperiment(
            "test-experiment-id",
            { userId: "test-user-id" }
        );

// Assert
        assert.deepEqual(result, { OFF: false });
        sinon.assert.notCalled(ExperimentStorage.incCallCount);
        sinon.assert.notCalled(ffLogic.featureCheckAttributes);
        sinon.assert.notCalled(abLogic.ABcheckAttributes);
    });
});