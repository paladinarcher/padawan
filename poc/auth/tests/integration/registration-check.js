const chai  = require("chai");
const http  = require("chai-http");
const tools = require("../tools");

chai.use(http);

describe("Checking registration api", () => {
	it("GET access should return 404", (done) => {
		try {
			chai
				.request(tools.service)
				.get("/api/v1/register")
				.set("Content-Type", "application/json")
				.send(tools.get200RegistrationData(0))
				.end((err, res) => {
					chai.expect(res).to.have.status(404);
					done();
				});
		} catch (e) {
			done(e);
		}
	});
	
	it("Missing password_confirm should return 422", (done) => {
		try {
			chai
				.request(tools.service)
				.post("/api/v1/register")
				.set("Content-Type", "application/json")
				.send(tools.get400RegistrationData(0))
				.end((err, res) => {
					chai.expect(res).to.have.status(422);
					done();
				});
		} catch (e) {
			done(e);
		}
	});

	it("Missing username and password_confirm should return 422", (done) => {
		try {
			chai
				.request(tools.service)
				.post("/api/v1/register")
				.set("Content-Type", "application/json")
				.send(tools.get400RegistrationData(1))
				.end((err, res) => {
					chai.expect(res).to.have.status(422);
					done();
				});
		} catch (e) {
			done(e);
		}
	});

	it("Valid user should return 201", (done) => {
		try {
			chai
				.request(tools.service)
				.post("/api/v1/register")
				.set("Content-Type", "application/json")
				.send(tools.get200RegistrationData(0))
				.end((err, res) => {
					chai.expect(res).to.have.status(201);
					done();
				});
		} catch (e) {
			done(e);
		}
	});

	it("Duplicate user should return 422", (done) => {
		try {
			chai
				.request(tools.service)
				.post("/api/v1/register")
				.set("Content-Type", "application/json")
				.send(tools.get200RegistrationData(0))
				.end((err, res) => {
					chai.expect(res).to.have.status(422);
					done();
				});
		} catch (e) {
			done(e);
		}
	});

	it("Valid user should return 201", (done) => {
		try {
			chai
				.request(tools.service)
				.post("/api/v1/register")
				.set("Content-Type", "application/json")
				.send(tools.get200RegistrationData(1))
				.end((err, res) => {
					chai.expect(res).to.have.status(201);
					done();
				});
		} catch (e) {
			done(e);
		}
	});
});
