const chai  = require("chai");
const http  = require("chai-http");
const tools = require("../tools");
const sinon = require("sinon");

chai.use(http);

describe("Checking password reset apis", () => {
	it("GET access to requestreset should return 404", (done) => {
		chai
			.request(tools.service)
			.get("/api/v1/requestreset")
			.set("Content-Type", "application/json")
			.end((err, res) => {
				chai.expect(res).to.have.status(404);
				done();
			});
	});

	it("GET access to reset should return 404", (done) => {
		chai
			.request(tools.service)
			.get("/api/v1/reset")
			.end((err, res) => {
				chai.expect(res).to.have.status(404);
				done();
			});
	});

	it("missing resetToken in queryParam should return 404", (done) => {
		chai
			.request(tools.service)
			.post("/api/v1/reset")
			.end((err, res) => {
				chai.expect(res).to.have.status(404);
				done();
			});
	});

	it("wrong username should return 400", (done) => {
		chai
			.request(tools.service)
			.post("/api/v1/requestreset")
			.set("Content-Type", "application/json")
			.send(tools.get400RequestResetData(0))
			.end((err, res) => {
				chai.expect(res).to.have.status(400);
				done();
			});
	});

	it("valid username should return resettoken and call to reset should return 200", (done) => {
		chai
			.request(tools.service)
			.post("/api/v1/requestreset")
			.set("Content-Type", "application/json")
			.send(tools.get200RequestResetData(0))
			.end((err, res) => {
				chai.expect(res).to.have.status(200);
				chai.expect(res.body).to.have.property('data');
				chai.expect(res.body.data).to.have.property('resetToken');
				const resetToken = res.body.data.resetToken;
				chai
					.request(tools.service)
					.post("/api/v1/reset")
					.query({resetToken})
					.set("Content-Type", "application/json")
					.send(tools.get200RequestResetData(1))
					.end((err, res) => {
						chai.expect(res).to.have.status(200);
						done();
					});
			});
	}).timeout(5000); // extend mocha's timeout to allow for time to send email

	it("valid username should return resettoken and call to reset with invalid token should return 400", (done) => {
		chai
			.request(tools.service)
			.post("/api/v1/requestreset")
			.set("Content-Type", "application/json")
			.send(tools.get200RequestResetData(0))
			.end((err, res) => {
				chai.expect(res).to.have.status(200);
				chai.expect(res.body).to.have.property('data');
				chai.expect(res.body.data).to.have.property('resetToken');
				const resetToken = res.body.data.resetToken;
				const clock = sinon.useFakeTimers({now: Date.now() + (36000000), shouldAdvanceTime: true});
				chai
					.request(tools.service)
					.post("/api/v1/reset")
					.query({resetToken})
					.set("Content-Type", "application/json")
					.send(tools.get200RequestResetData(1))
					.end((err, res) => {
						chai.expect(res).to.have.status(400);
						chai.expect(res.body.message).to.equal("Invalid password reset token");
						clock.restore();
						done();
					});
			});
	}).timeout(5000); // extend mocha's timeout to allow for time to send email
});