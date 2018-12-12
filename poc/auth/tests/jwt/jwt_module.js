const fs 		= require('fs');
const jwt 		= require('jsonwebtoken');

// http://travistidwell.com/blog/2013/09/06/an-online-rsa-public-and-private-key-generator/
// use 'utf8' to get string instead of byte array
/* Make sure the keys have the appropriate delimiters:
	-----BEGIN RSA PRIVATE KEY-----
	-----END RSA PRIVATE KEY-----
	*/
const privateKEY 	= fs.readFileSync('./private.key', 'utf8'); // to sign JWT
const publicKEY 	= fs.readFileSync('./public.key', 'utf8'); 	// to verify JWT

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
			expiresIn: 	timeout,
			algorithm: 	"RS256" // RSASSA options[ "RS256", "RS384", "RS512" ]
		};

		if (options) {
			signOptions = {...options, ...signOptions};
		}

		console.log({signOptions})

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
			expiresIn: 	timeout || 0,
			algorithm: 	["RS256"]
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