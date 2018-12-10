const chai  = require("chai");
const http  = require("chai-http");
const tools = require("../tools");

chai.use(http);

describe("Checking password user apis", () => {
	it("POST access to users should return 404", (done) => {
		chai
			.request(tools.service)
			.post("/api/v1/users")
			.set("Content-Type", "application/json")
			.end((err, res) => {
				chai.expect(res).to.have.status(404);
				done();
			});
	});

	it("/users with valid login return 200", (done) => {
		try {
			chai
				.request(tools.service)
				.post("/api/v1/login")
				.set("Content-Type", "application/json")
				.send(tools.get200LoginData(2))
				.end((err, res) => {
					chai.expect(res).to.have.status(200);
					chai.expect(res).to.have.cookie('token');
					chai.expect(res.body).to.have.property('data');
					const token = res.body.data;
					chai
						.request(tools.service)
						.get("/api/v1/users")
						.set("Content-Type", "application/json")
						.send(JSON.stringify({token}))
						.end((err, res) => {
							chai.expect(res).to.have.status(200);
							chai.expect(res.body).to.have.property('data');
							//FIXME: Add more detailed tests for data structure
							done();
						});
				});
		} catch (e) {
			done(e);
		}
	});

	it("/users with valid login but insufficient permission should return 404", (done) => {
		try {
			chai
				.request(tools.service)
				.post("/api/v1/login")
				.set("Content-Type", "application/json")
				.send(tools.get200LoginData(1))
				.end((err, res) => {
					chai.expect(res).to.have.status(200);
					chai.expect(res).to.have.cookie('token');
					chai.expect(res.body).to.have.property('data');
					const token = res.body.data;
					chai
						.request(tools.service)
						.get("/api/v1/users")
						.set("Content-Type", "application/json")
						.send(JSON.stringify({token}))
						.end((err, res) => {
							chai.expect(res).to.have.status(404);
							done();
						});
				});
		} catch (e) {
			done(e);
		}
	});
});