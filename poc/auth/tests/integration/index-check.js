const chai  = require("chai");
const http  = require("chai-http");
const tools = require("../tools");

chai.use(http);

describe("Checking top level api", () => {
	it("should return 200 if it exists", (done) => {
		chai
			.request(tools.service)
			.get("/api/v1")
			.set("Content-Type", "application/json")
			.end((err, res) => {
				chai.expect(res).to.have.status(200);
				chai.expect(res.body).to.have.property('message').eql('Success');
				chai.expect(res.body).to.have.property('data')
					.to.have.property('name').eql('Developer Level API');
				chai.expect(res.body).to.have.property('data')
					.to.have.property('version').eql('1.0.0.0');
				done();
			});
	});

	it("should return 404 if it doesn't exist", (done) => {
		chai
			.request(tools.service)
			.post("/someinvalidapi")
			.end((err, res) => {
				chai.expect(res).to.have.status(404);
				done();
			});
	});

	it("should return 404 if it doesn't exist", (done) => {
		chai
			.request(tools.service)
			.post("/api/v1/someinvalidapi")
			.end((err, res) => {
				chai.expect(res).to.have.status(404);
				done();
			});
	});
});
