randomString = (length) => {
	let text = "";
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

exports.get400Data = (index) => {
	array_400 = [
		// JSON data missing comma
		`{"email": "${randomString(10)}@${randomString(5)}.com", "username": "${randomString(10)}", "firstName": "${randomString(5)}" "lastName": "${randomString(10)}", "password":"foobar", "password-confirm":"foobar", "roles":["member", "admin"], "demographics":{"name":"Jane Doe", "gender":"female"}}`,
		// Missing password-confirm
		`{"email": "${randomString(9)}@${randomString(7)}.com", "username": "${randomString(15)}", "firstName": "${randomString(10)}", "lastName": "${randomString(12)}", "password":"foobar", "roles":["member"], "demographics":{"name":"John Doe", "gender":"male"}}`,
		// Missing username
		`{"email": "${randomString(10)}@${randomString(5)}.com", "firstName": "${randomString(5)}", "lastName": "${randomString(10)}", "password":"foobar", "password-confirm":"foobar", "roles":["member", "admin"], "demographics":{"name":"Jane Doe", "gender":"female"}}`,
	];

	if(index >= array_400.length) {
		return array_400[0];
	} else if (index < 0) {
		return array_400;
	} else {
		return array_400[index];
	}
}

exports.get200Data = (index) => {
	array_200 = [
		// member, admin
		`{"email": "${randomString(10)}@${randomString(5)}.com", "username": "${randomString(10)}", "firstName": "${randomString(5)}", "lastName": "${randomString(10)}", "password":"foobar", "password-confirm":"foobar", "roles":["member", "admin"], "demographics":{"name":"Jane Doe", "gender":"female"}}`,
		// member
		`{"email": "${randomString(8)}@gmail.com", "username": "${randomString(18)}", "firstName": "${randomString(20)}", "lastName": "${randomString(30)}", "password":"foobar", "password-confirm":"foobar", "roles":["member"], "demographics":{"name":"John Doe", "gender":"male"}}`,
	];
	
	if(index >= array_200.length) {
		return array_200[0];
	} else if (index < 0) {
		return array_200;
	} else {
		return array_200[index];
	}
}

exports.service = require("../start");
