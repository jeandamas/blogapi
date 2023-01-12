//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../app");
let should = chai.should();
chai.use(chaiHttp);

let jwt = "";

describe("USERS Endpoints", () => {
    it("/POST signup should fail if body fields are empty", (done) => {
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

    it("/GET DELETE JWT Token to logout user", (done) => {
        chai.request(app)
            .get("/api/logout")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("message").eql("Logged out");
                done();
            });
    });

    it("/GET current user", (done) => {
        chai.request(app)
            .get("/api/user")
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a("object");
                res.body.should.have
                    .property("message")
                    .eql("Logged In User Not Found");
                done();
            });
    });

    it("/GET Not authorised to get all users", (done) => {
        chai.request(app)
            .get("/api/users")
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a("object");
                res.body.should.have
                    .property("message")
                    .eql("Not authorized to perform this action");
                done();
            });
    });

    it("/POST ADMIN user login", (done) => {
        let user = {
            email: "contact@jean.rw",
            password: "adminpass",
        };
        chai.request(app)
            .post("/api/login")
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a("object");
                res.body.should.have
                    .property("message")
                    .eql("user logged in and token created");
                res.body.should.have.property("data").be.a("object");
                res.body.data.should.have.property("jwt");

                jwt = res.body.data.jwt;
                done();
            });
    });
});
