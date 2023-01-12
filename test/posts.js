//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../app");
let should = chai.should();
chai.use(chaiHttp);

describe("Blog posts endpoints", () => {
    it("/GET all blog posts", (done) => {
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

    it("/GET one non-existing blog post", (done) => {
        chai.request(app)
            .get("/api/posts/nonExistingID")
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a("object");
                res.body.should.have
                    .property("message")
                    .eql("post does not exist");
                res.body.should.have.property("data");
                done();
            });
    });

    it("/GET like a blog post", (done) => {
        chai.request(app)
            .get("/api/nonExistingID/like")
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a("object");
                done();
            });
    });

    it("/POST post route protection", (done) => {
        let post = {
            title: "sample title",
            imageURL:
                "https://jeanbucket001.s3.us-west-2.amazonaws.com/profile+image.jpeg",
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
