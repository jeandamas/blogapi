//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../app");
let should = chai.should();
chai.use(chaiHttp);
/*
 * Test the post /GET route
 */
describe("/GET blog posts", () => {
    console.log("BEGIN TESTING ENDPOINTS");
    it("GET retrieve all posts from database", (done) => {
        chai.request(app)
            .get("/api/posts")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("message").eql("success");
                res.body.should.have.property("data");
                res.body.data.should.be.a("array");
                done();
            });
    });
});

describe("/POST is post route protected", () => {
    it("POST fail to add new post if user is not logged in", (done) => {
        let post = {
            title: "sample title",
            content: "sample content",
        };
        chai.request(app)
            .post("/api/posts")
            .send(post)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a("object");
                res.body.should.have
                    .property("message")
                    .eql("Not authorized to perform this action");
                done();
            });
    });
});
