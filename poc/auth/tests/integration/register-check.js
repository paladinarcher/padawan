const chai  = require("chai");
const http  = require("chai-http");
const mongoose = require('mongoose');
const User = mongoose.model('User');
const tools = require("../tools");

chai.use(http);

describe("Checking registration api", () => {
	it("get access should return 404", (done) => {
		chai
		.request(tools.service)
		.get("/api/v1/register")
		.set("Content-Type", "application/json")
		.send(tools.get200Data(0))
		.end((err, res) => {
			chai.expect(res).to.have.status(404);
		});
		return done();
	});
	
	it("post with missing password confirm should return 400", (done) => {
		chai
		.request(tools.service)
		.post("/api/v1/register")
		.set("Content-Type", "application/json")
		.send(tools.get400Data(1))
		.end((err, res) => {
			chai.expect(res).to.have.status(400);
		});
		return done();
	});

	it("post with malformed JSON (missing comma) should return 400", (done) => {
		chai
		.request(tools.service)
		.post("/api/v1/register")
		.set("Content-Type", "application/json")
		.send(tools.get400Data(0))
		.end((err, res) => {
			chai.expect(res).to.have.status(400);
		});
		return done();
	});

	it("Valid user should return 201", (done) => {
		chai
		.request(tools.service)
		.post("/api/v1/register")
		.set("Content-Type", "application/json")
		.send(tools.get200Data(0))
		.end((err, res) => {
			chai.expect(res).to.have.status(201);
		});
		return done();
	});

	it("Duplicate user should return 400", (done) => {
		chai
		.request(tools.service)
		.post("/api/v1/register")
		.set("Content-Type", "application/json")
		.send(tools.get200Data(0))
		.end((err, res) => {
			chai.expect(res).to.have.status(400);
		});
		return done();
	});

	it("Valid user should return 201", (done) => {
		chai
		.request(tools.service)
		.post("/api/v1/register")
		.set("Content-Type", "application/json")
		.send(tools.get200Data(1))
		.end((err, res) => {
			chai.expect(res).to.have.status(201);
		});
		return done();
	});

	it("Duplicate user should return 400", (done) => {
		chai
		.request(tools.service)
		.post("/api/v1/register")
		.set("Content-Type", "application/json")
		.send(tools.get200Data(1))
		.end((err, res) => {
			chai.expect(res).to.have.status(400);
		});
		return done();
	});

	it("post with missing username should return 400", (done) => {
		chai
		.request(tools.service)
		.post("/api/v1/register")
		.set("Content-Type", "application/json")
		.send(tools.get400Data(2))
		.end((err, res) => {
			chai.expect(res).to.have.status(400);
		});
		return done();
	});

	after((done) => {
		tools.get200Data(-1).forEach(async (jsonstring) => {
			await User.findOne({ username: JSON.parse(jsonstring).username }).deleteOne();
		})
		return done();
	});
});
