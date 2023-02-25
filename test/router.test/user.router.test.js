const { expect } = require("chai");
const sinon = require("sinon");
const { userRouter } = require("../../router/user.routes");
const userController = require("../../controller/user.controller");

describe("userRouter", () => {
    describe("GET /:uuid", () => {
        it("should call getUserByUuid controller function with uuid param", async () => {
            const getUserByUuidStub = sinon.stub(userController, "getUserByUuid");
            const uuid = "abc123";
            const req = { params: { uuid } };
            const res = {};
            await userRouter.handle(req, res);
            expect(getUserByUuidStub.calledOnceWithExactly(uuid)).to.be.true;
            getUserByUuidStub.restore();
        });
    });

    describe("GET /experiment/:experimentId", () => {
        it("should call getUserExperiment controller function with experimentId param", async () => {
            const getUserExperimentStub = sinon.stub(userController, "getUserExperiment");
            const experimentId = "def456";
            const req = { params: { experimentId } };
            const res = {};
            await userRouter.handle(req, res);
            expect(getUserExperimentStub.calledOnceWithExactly(experimentId)).to.be.true;
            getUserExperimentStub.restore();
        });
    });

    describe("GET /set-cookie", () => {
        it("should call setCookie controller function", async () => {
            const setCookieStub = sinon.stub(userController, "setCookie");
            const req = {};
            const res = {};
            await userRouter.handle(req, res);
            expect(setCookieStub.calledOnce).to.be.true;
            setCookieStub.restore();
        });
    });

    describe("GET /cookie", () => {
        it("should call getCookie controller function", async () => {
            const getCookieStub = sinon.stub(userController, "getCookie");
            const req = {};
            const res = {};
            await userRouter.handle(req, res);
            expect(getCookieStub.calledOnce).to.be.true;
            getCookieStub.restore();
        });
    });

    describe("POST /", () => {
        it("should call addUser controller function", async () => {
            const addUserStub = sinon.stub(userController, "addUser");
            const req = { body: { name: "John Doe" } };
            const res = {};
            await userRouter.handle(req, res);
            expect(addUserStub.calledOnceWithExactly(req.body)).to.be.true;
            addUserStub.restore();
        });
    });

    describe("PUT /:uuid", () => {
        it("should call insertExperiment controller function with uuid and body params", async () => {
            const insertExperimentStub = sinon.stub(userController, "insertExperiment");
            const uuid = "abc123";
            const experiment = { experimentId: "def456", variant: "A" };
            const req = { params: { uuid }, body: experiment };
            const res = {};
            await userRouter.handle(req, res);
            expect(insertExperimentStub.calledOnceWithExactly(uuid, experiment)).to.be.true;
            insertExperimentStub.restore();
        });
    });

    describe("GET /", () => {
        it("should call getAllUsers controller function", async () => {
            const getAllUsersStub = sinon.stub(userController, "getAllUsers");
            const req = {};
            const res = {};
            await userRouter.handle(req, res);
            expect(getAllUsersStub.calledOnce).to.be.true;
            getAllUsersStub.restore();
        });
    });
});
