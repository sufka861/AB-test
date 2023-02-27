const userRepository= require ("../../repositories/user.repository");
const { v4: uuidv4, validate: uuidValidator } = require("uuid");
const {
    PropertyNotFound,
    EntityNotFound,
} = require("../../errors/NotFound.errors");
const chai = require('chai');
const expect = chai.expect;
const { InvalidProperty, ServerUnableError } = require('../../errors/validation.errors');
const sinon = require("sinon");
const {
    getAllUsers,
    getUserByUuid,
    getCookie,
    addUser,
    insertExperiment,
    getUserExperiment,
    generateUuid
} = require("../../controller/user.controller");

describe("getAllUsers", () => {
    it("should return all users", async () => {
        const res = {
            status: () => ({ json: (data) => data }),
        };
        const users = await getAllUsers({}, res);
        expect(users).to.be.an("array");
        expect(users.length).to.equal(2);
    });
});

describe("getUserByUuid", () => {
    it("should throw an error if no uuid is found", async () => {
        const req = {};
        const res = {};
        try {
            await getUserByUuid(req, res);
        } catch (err) {
            expect(err).to.be.an.instanceOf(EntityNotFound);
            expect(err.message).to.equal(`${'user'} not found...`);
        }
    });
});


describe("getCookie", () => {
    it("should return uuid cookie value if found", () => {
        const req = {
            cookies: { uuid: "1234" },
        };
        const uuid = getCookie(req);
        expect(uuid).to.equal("1234");
    });

    it("should return false if uuid cookie is not found", () => {
        const req = {
            cookies: {},
        };
        const uuid = getCookie(req);
        expect(uuid).to.be.false;
    });
});



describe('User Controller', () => {
    describe('addUser', () => {
        let req, res, createUserStub;

        beforeEach(() => {
            req = {};
            res = {};
            createUserStub = sinon.stub(userRepository, 'createUser');
        });

        afterEach(() => {
            createUserStub.restore();
        });

        it('should create a new user and return the user object', async () => {
            const uuid = '65y5y566';
            const user = { uuid };
            const newUser = { ...user, id: 1 };
            sinon.stub(global, 'generateUuid').returns(uuid);
            createUserStub.withArgs(user).returns(newUser);
            const result = await addUser(req, res);
            expect(result).to.deep.equal(newUser);
            expect(createUserStub.calledOnceWithExactly(user)).to.be.true;
        });

        it('should throw an InvalidProperty error if the generated uuid is invalid', async () => {
            sinon.stub(global, 'generateUuid').returns('invalid_uuid');
            try {
                await addUser(req, res);
            } catch (error) {
                expect(error).to.be.an.instanceOf(InvalidProperty);
                expect(error.message).to.equal('uuid');
            }
        });

        it('should throw a ServerUnableError error if the user creation fails', async () => {
            sinon.stub(global, 'generateUuid').returns('u684h5b');
            createUserStub.returns(null);
            try {
                await addUser(req, res);
            } catch (error) {
                expect(error).to.be.an.instanceOf(ServerUnableError);
                expect(error.message).to.equal('create');
            }
        });
    });
});


describe("insertExperiment", () => {
    it("should throw an error if uuid is not provided", async () => {
        const uuid = {};
        try {
            await insertExperiment(uuid, {variant: "A"});
        } catch (err) {
            expect(err).to.be.an.instanceOf(PropertyNotFound);
            expect(err.message).to.equal(uuid);
        }
    });

    it("should throw an error if variant is not provided", async () => {
        const experimentId = "6023f3d345281d5278dc6680";
        const experiment = {
            _id: experimentId,
            type: "a-b",
            variantsAB: {},
            variantSuccessCount: {
                A: 100,
                B: 200,
                C: 300,
            },
        };
        try {
            await insertExperiment("experimentId", experiment);
        } catch (err) {
            expect(err).to.be.an.instanceOf(PropertyNotFound);
            expect(err.message).to.equal(`Property: ${'variant'} not found...`);
        }
    });


    it("should update the user with the experiment", async () => {
        const uuid = "1234";
        const experiment = {
            _id: experimentId,
            type: "a-b",
            variantsAB: {
                A:"blue",
            },
            variantSuccessCount: {
                A: 100,
                B: 200,
                C: 300,
            },
        };
        const updatedUser = await insertExperiment(uuid, experiment);
        expect(updatedUser).to.be.an("object");
        expect(updatedUser.experiments).
        describe("getUserByUuid", () => {
            it("should throw an error if uuid is not found in cookie", async () => {
                const req = {cookies: {}};
                const res = {};
                await expect(getUserByUuid(req, res)).to.be.rejectedWith(Error, "user");
            });

            it("should throw an error if user is not found in repository", async () => {
                const uuid = "abcd";
                const req = {cookies: {uuid}};
                const res = {};
                sinon.stub(userRepository, "retrieveByUuid").resolves([]);
                await expect(getUserByUuid(req, res)).to.be.rejectedWith(Error, "user");
                userRepository.retrieveByUuid.restore();
            });

            it("should return the user if found in repository", async () => {
                const uuid = "abcd";
                const req = {cookies: {uuid}};
                const res = {};
                const user = {uuid};
                sinon.stub(userRepository, "retrieveByUuid").resolves([user]);
                const result = await getUserByUuid(req, res);
                expect(result).to.deep.equal(user);
                userRepository.retrieveByUuid.restore();
            })
        })
    })
    describe("User Routes", () => {
        it("should return all users", async () => {
            const res = await request(app).get("/users");
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("array");
        });

        it("should return a specific user by uuid", async () => {
            const res = await (app).get("/users/12345");
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("uuid", "12345");
        });

        it("should return an experiment for a user by experiment id", async () => {
            const res = await request(app).get("/users/experiment/12345");
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("experimentId", "12345");
        });

        it("should create a new user", async () => {
            const res = await request(app)
                .post("/users")
                .send({
                    name: "John Doe",
                    email: "john.doe@example.com",
                    password: "password",
                });
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("name", "John Doe");
            expect(res.body).to.have.property("email", "john.doe@example.com");
        });

        it("should add an experiment to a user", async () => {
            const res = await request(app)
                .put("/users/12345")
                .send({
                    experimentId: "54321",
                });
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("uuid", "12345");
            expect(res.body).to.have.property("experimentId", "54321");
        });

        it("should return cookie values", async () => {
            const res = await request(app).get("/users/cookie");
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("cookie");
        });

    });
});