const chai  = require("chai");
const http  = require("chai-http");
const tools = require("../tools");

chai.use(http);

describe("Checking login api", () => {
	it("GET access should return 404", (done) => {
		try {
			chai
				.request(tools.service)
				.get("/api/v1/login")
				.set("Content-Type", "application/json")
				.send(tools.get200LoginData(0))
				.end((err, res) => {
					chai.expect(res).to.have.status(404);
					done();
				});;
		} catch (e) {
			done(e);
		}
	});

	it("Missing password should return 422", (done) => {
		try {
			chai
				.request(tools.service)
				.post("/api/v1/login")
				.set("Content-Type", "application/json")
				.send(tools.get400LoginData(0))
				.end((err, res) => {
					chai.expect(res).to.have.status(422);
					done();
				});
		} catch (e) {
			done(e);
		}
	});

	it("Missing username should return 422", (done) => {
		try {
			chai
				.request(tools.service)
				.post("/api/v1/login")
				.set("Content-Type", "application/json")
				.send(tools.get400LoginData(1))
				.end((err, res) => {
					chai.expect(res).to.have.status(422);
					done();
				});
		} catch (e) {
			done(e);
		}
	});

	it("Invalid username should return 400", (done) => {
		try {
			chai
				.request(tools.service)
				.post("/api/v1/login")
				.set("Content-Type", "application/json")
				.send(tools.get400LoginData(2))
				.end((err, res) => {
					chai.expect(res).to.have.status(400);
					done();
				});
		} catch (e) {
			done(e);
		}
	});

	it("Invalid password should return 400", (done) => {
		try {
			chai
				.request(tools.service)
				.post("/api/v1/login")
				.set("Content-Type", "application/json")
				.send(tools.get400LoginData(3))
				.end((err, res) => {
					chai.expect(res).to.have.status(400);
					done();
				});
		} catch (e) {
			done(e);
		}
	});

	it("Valid login credentials should return 200", (done) => {
		try {
			chai
				.request(tools.service)
				.post("/api/v1/login")
				.set("Content-Type", "application/json")
				.send(tools.get200LoginData(0))
				.end((err, res) => {
					chai.expect(res).to.have.cookie('token');
					chai.expect(res.body).to.have.property('data');
					chai.expect(res).to.have.status(200);
					done();
				});
		} catch (e) {
			done(e);
		}
	});
});
