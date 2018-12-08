randomString = (length) => {
	let text = "";
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

exports.get400RegistrationData = (index) => {
	if(index >= array_400_registration_data.length) {
		return array_400_registration_data[0];
	} else if (index < 0) {
		return array_400_registration_data;
	} else {
		return array_400_registration_data[index];
	}
}

exports.get200RegistrationData = (index) => {
	if(index >= array_200_registration_data.length) {
		return array_200_registration_data[0];
	} else if (index < 0) {
		return array_200_registration_data;
	} else {
		return array_200_registration_data[index];
	}
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

array_400_registration_data = [
	// Missing password_confirm
	JSON.stringify((({email, username, firstName, lastName, password, roles, demographics}) => 
		({email, username, firstName, lastName, password, roles, demographics}))(user_data[0])),
	// Missing username and password_confirm
	JSON.stringify((({email, firstName, lastName, password, roles, demographics}) => 
		({email, firstName, lastName, password, roles, demographics}))(user_data[1])),
];

array_200_registration_data = [
	JSON.stringify(user_data[0]),
	JSON.stringify(user_data[1]),
];

exports.service = require("../start");
