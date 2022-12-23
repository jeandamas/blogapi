//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../app");
let should = chai.should();
chai.use(chaiHttp);

describe("/POST signup", () => {
    it("POST should fail if body fields are empty", (done) => {
        let post = {
            name: "",
            content: "",
            password: "",
        };
        chai.request(app)
            .post("/api/signup")
            .send(post)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                res.body.should.have.property("errors");
                res.body.errors.should.have
                    .property("name")
                    .eql("Name should not be empty");
                res.body.errors.should.have
                    .property("email")
                    .eql("Please enter an email");
                res.body.errors.should.have
                    .property("password")
                    .eql("Minimun password length is 6 characters");
                done();
            });
    });
});

describe("/POST signup", () => {
    it("POST should fail if user already exists", (done) => {
        let post = {
            name: "bb",
            content: "bb@jean.rw",
            password: "bbpassword",
        };
        chai.request(app)
            .post("/api/signup")
            .send(post)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                // res.body.should.have.property("status").eql("400");
                // res.body.should.have.property("errors");
                // res.body.errors.have
                //     .property("email")
                //     .eq("Email already registered");
                done();
            });
    });
});

describe("/POST login", () => {
    it("POST Login user", (done) => {
        let post = {
            email: "contact@jean.rw",
            password: "adminpass",
        };
        chai.request(app)
            .post("/api/login")
            .send(post)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a("object");
                res.body.should.have.property("statusCode").eql(201);
                res.body.should.have
                    .property("message")
                    .eq("user logged in and token created");
                res.body.should.have.property("data");
                res.body.data.should.have.property("Name");
                res.body.data.should.have.property("Email");
                res.body.data.should.have.property("jwt").be.a("string");
                done();
            });
    });
});
