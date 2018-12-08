const fs    = require("fs");
const path  = require("path");
const mocha = require("mocha");
const suite = new mocha();

fs.readdir(path.join(__dirname, "integration"), (err, files) => {
	if (err) throw err;

	const testfiles = files.filter((filename) => {
		return filename.match("testgroup.js");
	});

	if (testfiles.length > 0) {
		testfiles.forEach((testfile) => 
		suite.addFile(path.join(__dirname, "integration", testfile)));
	} else {
		files.filter((filename) => (filename.match(/\.js$/))).map((filename) => {
			suite.addFile(path.join(__dirname, "integration", filename));
		});
	}

	suite.run((failures) => {
		process.exit(failures);
	});
});
