'use strict';
const {sign, verify, decode } = require('./jwt_module');

// PAYLOAD
const payload = {
	data1: "Data 1",
	data2: "Data 2",
	data3: "Data 3",
	data4: "Data 4",
};

const userId = '123456789';

// PRIVATE and PUBLIC key
const i  = 'My corp'; // Issuer 
const s  = userId;		// Subject 
const a  = userId; 		// Audience

// SIGNING OPTIONS
const signOptions = {
	issuer:  i,
	subject:  s,
	audience:  a,
};

const numSeconds = 3;

const token = sign({payload, timeout: numSeconds, options: signOptions});
console.log("Signed token - " + token);

const decodedToken = decode(token);
console.log({decodedToken});

const start = Date.now();
setTimeout(function() {
	const millis = Date.now() - start;

	console.log("seconds elapsed = " + Math.floor(millis/1000));
	// expected output : seconds elapsed = 2

	const verifyOptions = {
		issuer:  i,
		subject:  s,
		audience:  a,
	};

	const legit = verify({token});
	console.log("\nJWT verification result: " + JSON.stringify(legit));
  }, 2000);

