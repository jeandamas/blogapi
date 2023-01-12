//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../app");
let should = chai.should();
chai.use(chaiHttp);

describe("Messages endpoints", () => {
    it("/GET all blog messages", (done) => {
        chai.request(app)
            .get("/api/messages")
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a("object");
                res.body.should.have
                    .property("message")
                    .eql("Not authorized to perform this action");
                done();
            });
    });

    it("/POST message", (done) => {
        let message = {
            name: "test name",
            email: "testemail@gmail.com",
            message: "hello this is the test message",
        };
        chai.request(app)
            .post("/api/messages")
            .send(message)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a("object");
                res.body.should.have.property("message").eql("Message Created");
                done();
            });
    });
});
