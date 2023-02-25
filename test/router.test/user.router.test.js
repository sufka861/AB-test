const chai = require("chai");
const chaiHttp = require("chai-http");
const { userRouter } = require("../routes/user.routes");

chai.use(chaiHttp);

const expect = chai.expect;

describe("User routes", () => {
    describe("GET /:uuid", () => {
        it("should return user with matching uuid", async () => {
            const res = await chai
                .request(userRouter)
                .get("/abc123")
                .send();

            expect(res).to.have.status(200);
            expect(res.body).to.have.property("uuid", "abc123");
        });

        it("should return 404 for non-existent uuid", async () => {
            const res = await chai
                .request(userRouter)
                .get("/non-existent-uuid")
                .send();

            expect(res).to.have.status(404);
        });
    });

    describe("GET /experiment/:experimentId", () => {
        it("should return experiment for user with matching experiment ID", async () => {
            const res = await chai
                .request(userRouter)
                .get("/experiment/123")
                .send();

            expect(res).to.have.status(200);
            expect(res.body).to.have.property("experimentId", "123");
        });

        it("should return 404 for non-existent experiment ID", async () => {
            const res = await chai
                .request(userRouter)
                .get("/experiment/non-existent-experiment-id")
                .send();

            expect(res).to.have.status(404);
        });
    });

    describe("GET /set-cookie", () => {
        it("should set a cookie", async () => {
            const res = await chai.request(userRouter).get("/set-cookie").send();

            expect(res).to.have.status(200);
            expect(res).to.have.cookie("my-cookie");
        });
    });

    describe("GET /cookie", () => {
        it("should return the value of the cookie", async () => {
            const agent = chai.request.agent(userRouter);

            await agent.get("/set-cookie").send();

            const res = await agent.get("/cookie").send();

            expect(res).to.have.status(200);
            expect(res.text).to.equal("cookie value");
        });

        it("should return 404 if cookie is not set", async () => {
            const res = await chai.request(userRouter).get("/cookie").send();

            expect(res).to.have.status(404);
        });
    });

    describe("POST /", () => {
        it("should create a new user", async () => {
            const user = {name: "John Doe", email: "john@example.com"};

            const res = await chai.request(userRouter).post("/").send(user);

            expect(res).to.have.status(201);
            expect(res.body).to.have.property("name", "John Doe");
            expect(res.body).to.have.property("email", "john@example.com");
        });

        it("should return 400 for invalid user attributes", async () => {
            const user = {name: "John Doe"}; // missing email attribute

            const res = await chai.request(userRouter).post("/").send(user);

            expect(res).to.have.status(400);
        })
    })
});