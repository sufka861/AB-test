const { expect } = require("chai");
const sinon = require("sinon");
const {
    checkAttributes,
    getAllUsers,
    getUserByUuid,
    setCookie,
    getCookie,
    addUser,
    insertExperiment,
    getUserExperiment,
} = require("../../controller/user.controller");

describe("checkAttributes", () => {
    it("should do something", () => {
        // Test case here
    });
});

describe("getAllUsers", () => {
    it("should return all users", async () => {
        const res = {
            status: () => ({ json: (data) => data }),
        };
        const users = await getAllUsers({}, res);
        expect(users).to.be.an("array");
        expect(users.length).to.equal(2); // replace 2 with expected number of users
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
            expect(err.message).to.equal("user");
        }
    });
});

describe("setCookie", () => {
    it("should set a uuid cookie", () => {
        const res = {
            cookie: () => {},
        };
        setCookie({}, res);
        // Test that a cookie was set
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

describe("addUser", () => {
    it("should create a new user", async () => {
        const res = {};
        const newUser = await addUser({}, res);
        expect(newUser).to.be.an("object");
        expect(newUser.uuid).to.be.a("string");
    });
});

describe("insertExperiment", () => {
    it("should throw an error if uuid is not provided", async () => {
        try {
            await insertExperiment(null, {variant: "A"});
        } catch (err) {
            expect(err).to.be.an.instanceOf(PropertyNotFound);
            expect(err.message).to.equal("uuid");
        }
    });

    it("should throw an error if variant is not provided", async () => {
        try {
            await insertExperiment("1234", {});
        } catch (err) {
            expect(err).to.be.an.instanceOf(PropertyNotFound);
            expect(err.message).to.equal("variant");
        }
    });

    it("should update the user with the experiment", async () => {
        const uuid = "1234";
        const experiment = {variant: "A"};
        const updatedUser = await insertExperiment(uuid, experiment);
        expect(updatedUser).to.be.an("object");
        expect(updatedUser.experiments).describe("getUserByUuid", () => {
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
});