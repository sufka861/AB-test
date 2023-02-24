const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
chai.use(chaiHttp);

const app = require("../app");
const { userRouter } = require("../routes/user.router");

describe("User Routes", () => {
    describe("GET /users", () => {
        it("should return all users", (done) => {
            chai
                .request(app)
                .get("/users")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("array");
                    expect(res.body.length).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe("GET /users/:uuid", () => {
        it("should return a user by uuid", (done) => {
            chai
                .request(app)
                .get("/users/1")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("object");
                    expect(res.body.uuid).to.equal("1");
                    done();
                });
        });
    });

    describe("GET /users/experiment/:experimentId", () => {
        it("should return users by experiment id", (done) => {
            chai
                .request(app)
                .get("/users/experiment/1")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("array");
                    expect(res.body.length).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe("GET /users/set-cookie", () => {
        it("should set a cookie", (done) => {
            chai
                .request(app)
                .get("/users/set-cookie")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.have.cookie("cookieName");
                    done();
                });
        });
    });

    describe("GET /users/cookie", () => {
        it("should return cookie values", (done) => {
            chai
                .request(app)
                .get("/users/cookie")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("object");
                    expect(res.body.cookieName).to.equal("cookieValue");
                    done();
                });
        });
    });

    describe("POST /users", () => {
        it("should create a new user", (done) => {
            const newUser = {
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
            };
            chai
                .request(app)
                .post("/users")
                .send(newUser)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an("object");
                    expect(res.body.firstName).to.equal(newUser.firstName);
                    expect(res.body.lastName).to.equal(newUser.lastName);
                    expect(res.body.email).to.equal(newUser.email);
                    done();
                });
        });
    });

    describe("PUT /users/:uuid", () => {
        it("should add an experiment to a user", (done) => {
            const experiment = {
                experimentId: "1",
                variant: "A",
            };
            chai
                .request(app)
                .put("/users/1")
                .send(newUser)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an("object");
                    expect(res.body.firstName).to.equal(newUser.firstName);
                    expect(res.body.lastName).to.equal(newUser.lastName);
                    expect(res.body.email).to.equal(newUser.email);
                    done();
                });
        });
    })
});
