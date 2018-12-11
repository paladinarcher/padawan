const chai  = require("chai");
const http  = require("chai-http");
const sinon = require("sinon");
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

	it("POST to isLoggedIn should return 404", (done) => {
		try {
			chai
				.request(tools.service)
				.post("/api/v1/isLoggedin")
				.end((err, res) => {
					chai.expect(res).to.have.status(404);
					done();
				});
		} catch (e) {
			done(e);
		}
	});

	it("Valid cookie used with isLoggedIn should return 200", (done) => {
		try {
			chai
				.request(tools.service)
				.post("/api/v1/login")
				.set("Content-Type", "application/json")
				.send(tools.get200LoginData(0))
				.end((err, res) => {
					chai.expect(res).to.have.status(200);
					chai.expect(res).to.have.cookie('token');
					chai.expect(res.body).to.have.property('data');
					const token = res.body.data;
					chai
						.request(tools.service)
						.get("/api/v1/isLoggedin")
						.set("Content-Type", "application/json")
						.send(JSON.stringify({token}))
						.end((err, res) => {
							chai.expect(res).to.have.status(200);
							done();
						});

				});
		} catch (e) {
			done(e);
		}
	});

	it("logout should cause isLoggedIn to return 404", (done) => {
		try {
			chai
				.request(tools.service)
				.post("/api/v1/login")
				.set("Content-Type", "application/json")
				.send(tools.get200LoginData(0))
				.end((err, res) => {
					chai.expect(res).to.have.status(200);
					chai.expect(res).to.have.cookie('token');
					chai.expect(res.body).to.have.property('data');
					const token = res.body.data;
					chai
						.request(tools.service)
						.get("/api/v1/isLoggedin")
						.set("Content-Type", "application/json")
						.send(JSON.stringify({token}))
						.end((err, res) => {
							chai.expect(res).to.have.status(200);
							chai
								.request(tools.service)
								.get("/api/v1/logout")
								// FIXME: check for empty cookie
								.end((err, res) => {
									chai
										.request(tools.service)
										.get("/api/v1/isLoggedin")
										.end((err, res) => {
											// Kind of a meaningless test because no token is passed
											chai.expect(res).to.have.status(404);
											done();
										});
								});
						});
				});
		} catch (e) {
			done(e);
		}
	});

	it("token expiration should return a 400", (done) => {
		try {
			chai
				.request(tools.service)
				.post("/api/v1/login")
				.set("Content-Type", "application/json")
				.send(tools.get200LoginData(0))
				.end((err, res) => {
					chai.expect(res).to.have.status(200);
					chai.expect(res).to.have.cookie('token');
					chai.expect(res.body).to.have.property('data');
					const token = res.body.data;
					const clock = sinon.useFakeTimers({now: Date.now() + (1000 * 60 * 60 * 24 * 365), shouldAdvanceTime: true});
					chai
						.request(tools.service)
						.get("/api/v1/isLoggedin")
						.set("Content-Type", "application/json")
						.send(JSON.stringify({token}))
						.end((err, res) => {
							chai.expect(res).to.have.status(400);
							clock.restore();
							done();
						});

				});
		} catch (e) {
			done(e);
		}
	});

	it("token about to expire should return a 200", (done) => {
		try {
			chai
				.request(tools.service)
				.post("/api/v1/login")
				.set("Content-Type", "application/json")
				.send(tools.get200LoginData(0))
				.end((err, res) => {
					chai.expect(res).to.have.status(200);
					chai.expect(res).to.have.cookie('token');
					chai.expect(res.body).to.have.property('data');
					const token = res.body.data;
					const clock = sinon.useFakeTimers({now: Date.now() + (1000 * 58 * 60 * 24 * 365), shouldAdvanceTime: true});
					chai
						.request(tools.service)
						.get("/api/v1/isLoggedin")
						.set("Content-Type", "application/json")
						.send(JSON.stringify({token}))
						.end((err, res) => {
							chai.expect(res).to.have.status(200);
							clock.restore();
							done();
						});

				});
		} catch (e) {
			done(e);
		}
	});
});
