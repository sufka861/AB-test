const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
chai.use(chaiHttp);

const app = require("AB-test/app.js");
const statsRouter = require('../../router/stats.router');
const statsController = require('../../controller/stats.controller');

describe("Stats Routes", () => {
    describe("GET /stats/userVariant/:id", () => {
        it("should return user stats", (done) => {
            chai
                .request(app)
                .get(`/stats/userVariant/1`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("array");
                    expect(res.body.length).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe("GET /stats/:id", () => {
        it("should return statistics", (done) => {
            chai
                .request(app)
                .get(`/stats/1`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("object");
                    expect(res.body.id).to.equal(1);
                    done();
                });
        });
    });
});

