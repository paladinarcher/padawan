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
	if(index >= registration_400_data.length) {
		return registration_400_data[0];
	} else if (index < 0) {
		return registration_400_data;
	} else {
		return registration_400_data[index];
	}
}

exports.get200LoginData = (index) => {
	if(index >= registration_200_data.length) {
		return registration_200_data[0];
	} else if (index < 0) {
		return registration_200_data;
	} else {
		return registration_200_data[index];
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
		email: `e_${randomString(10)}@${randomString(5)}.com`,
		username: `u_${randomString(10)}`, 
		firstName: `f_${randomString(5)}`,
		lastName: `l_${randomString(10)}`, 
		password: "foobar",
		password_confirm: "foobar",
		roles:["member", "admin"], 
		demographics: {
			name: "Jane Doe", 
			gender:" female"
		},
	},
	{
		email: `e_${randomString(13)}@gmail.com`, 
		username: `u_${randomString(15)}`, 
		firstName: `f_${randomString(8)}`,
		lastName: `l_${randomString(15)}`, 
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
	JSON.stringify((({username}) => 
		({username}))(user_data[0])),
	// Missing username
	JSON.stringify((({password}) => 
		({password}))(user_data[1])),

];

login_200_data = [
	JSON.stringify((({username, password}) => 
		({username, password}))(user_data[0])),
	JSON.stringify((({username, password}) => 
		({username, password}))(user_data[1])),
];

exports.service = require("../start");
