exports.get400RegistrationData = (index) => {
	if(index >= registration_400_data.length) {
		return registration_400_data[0];
	} else if (index < 0) {
		return registration_400_data;
	} else {
		return registration_400_data[index];
	}
}

exports.get200RegistrationData = (index) => {
	if(index >= registration_200_data.length) {
		return registration_200_data[0];
	} else if (index < 0) {
		return registration_200_data;
	} else {
		return registration_200_data[index];
	}
}

exports.get400LoginData = (index) => {
	if(index >= login_400_data.length) {
		return login_400_data[0];
	} else if (index < 0) {
		return login_400_data;
	} else {
		return login_400_data[index];
	}
}

exports.get200LoginData = (index) => {
	if(index >= login_200_data.length) {
		return login_200_data[0];
	} else if (index < 0) {
		return login_200_data;
	} else {
		return login_200_data[index];
	}
}

exports.get400RequestResetData = (index) => {
	if(index >= requestreset_400_data.length) {
		return requestreset_400_data[0];
	} else if (index < 0) {
		return requestreset_400_data;
	} else {
		return requestreset_400_data[index];
	}
}

exports.get200RequestResetData = (index) => {
	if(index >= requestreset_200_data.length) {
		return requestreset_200_data[0];
	} else if (index < 0) {
		return requestreset_200_data;
	} else {
		return requestreset_200_data[index];
	}
}

randomString = (length) => {
	let text = "";
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

// Base user data
user_data = [
	{
		email: "jane@someemailserver.com",
		username: "janedoe", 
		firstName: "Jane",
		lastName: "Doe", 
		password: "foobar",
		password_confirm: "foobar",
		roles:["member", "admin"], 
		demographics: {
			name: "Jane Doe", 
			gender:" female"
		},
	},
	{
		email: "john@gmail.com", 
		username: "johndoe", 
		firstName: "John",
		lastName: "Doe", 
		password: "barfoo",
		password_confirm: "barfoo",
		roles:["member"], 
		demographics: {
			name: "John Doe", 
			gender:" male"
		},
	},
];

registration_400_data = [
	// Missing password_confirm
	JSON.stringify((({email, username, firstName, lastName, password, roles, demographics}) => 
		({email, username, firstName, lastName, password, roles, demographics}))(user_data[0])),
	// Missing username and password_confirm
	JSON.stringify((({email, firstName, lastName, password, roles, demographics}) => 
		({email, firstName, lastName, password, roles, demographics}))(user_data[1])),
];

registration_200_data = [
	JSON.stringify(user_data[0]),
	JSON.stringify(user_data[1]),
];

login_400_data = [
	// Missing password
	JSON.stringify({
		username: user_data[0].username,
	}),
	// Missing username
	JSON.stringify({
		password: user_data[0].password,
	}),
	// Invalid username
	JSON.stringify({
		username: "wrongusername",
		password: user_data[0].password,
	}),
	// Valid username, wrong password
	JSON.stringify({
		username: user_data[0].username,
		password: "wrongpassword",
	})

];

login_200_data = [
	JSON.stringify({
		username: user_data[0].username,
		password: user_data[0].password,
	}),
	JSON.stringify({
		username: user_data[1].username,
		password: user_data[1].password,
	})
];

requestreset_400_data = [
	JSON.stringify({
		username: "wrongusername",
	}),
];

requestreset_200_data = [
	JSON.stringify({
		username: user_data[0].username,
	}),
	JSON.stringify({
		password: "anewpassword",
		password_confirm: "anewpassword",
	}),
];

exports.service = require("../start");
