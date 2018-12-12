const fs 		= require('fs');
const jwt 		= require('jsonwebtoken');

let privateKEY = null;
let publicKEY = null;

//https://stackoverflow.com/questions/39239051/rs256-vs-hs256-whats-the-difference
if (process.env.JWT_ALGORITHM === "HS256") {
	if (process.env.NODE_ENV === 'development') {
		console.log("Using HS256 authentication");
	}
	
	privateKEY = process.env.APP_HS256_SECRET;
	publicKEY = process.env.APP_HS256_SECRET;
} else if (process.env.JWT_ALGORITHM === "RS256") {
	// http://travistidwell.com/blog/2013/09/06/an-online-rsa-public-and-private-key-generator/
	// use 'utf8' to get string instead of byte array
	/* Make sure the keys have the appropriate delimiters:
	   -----BEGIN RSA PRIVATE KEY-----
	   -----END RSA PRIVATE KEY-----
	 */
	if (process.env.NODE_ENV === 'development') {
		console.log("Using RS256 authentication");
	}
	privateKEY = fs.readFileSync(`${process.env.APP_RS256_PRIVATE_KEY_FILE}`, 'utf8'); // to sign JWT
	publicKEY = fs.readFileSync(`${process.env.APP_RS256_PUBLIC_KEY_FILE}`, 'utf8'); 	// to verify JWT
} else {
	throw new Error("Invalid JWT_ALGORITHM specified in variables.env (must be either 'HS256' or 'RS256'");
}

module.exports = {
	sign: ({payload, timeout, options}) => {
		/*
			options = {
				issuer: "This server",
				subject: "userid" or "user email", 
				audience: "Client_Identity" // this should be provided by client
			}
		*/

		// Token signing options
		let signOptions = {
			expiresIn: 	timeout, // no default timeout provided, thus a value must be supplied
			algorithm: 	process.env.JWT_ALGORITHM // options[ "HS256", "RS256". Others include "RS384", "RS512" ]
		};

		if (options) {
			signOptions = {...options, ...signOptions};
		}

		return jwt.sign(payload, privateKEY, signOptions);
	},

	verify: ({token, timeout, options}) => {
		/*
			vOption = {
				issuer: "This server",
				subject: "userid" or "user email", 
				audience: "Client_Identity" // this should be provided by client
			}		
		*/
		let verifyOptions = {
			expiresIn: 	timeout || 0, // typically this value is zero on verify
			algorithm: 	[process.env.JWT_ALGORITHM]
		};

		if (options) {
			verifyOptions = {...options, ...verifyOptions};
		}

		try {
			return jwt.verify(token, publicKEY, verifyOptions);
		}catch(err){
			return false;
		}
	}, 

	decode: (token) => {
		return jwt.decode(token, {complete: true});
	}
}