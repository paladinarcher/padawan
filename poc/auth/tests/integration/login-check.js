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
			.send(tools.get200RegistrationData(0))
			.end((err, res) => {
				chai.expect(res).to.have.status(404);
			});
			return done();
		} catch (e) {
			done(e);
		}
	});
});
