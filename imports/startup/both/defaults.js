import { Meteor } from 'meteor/meteor';

const Defaults = {
	'user': {
		'username': 'admin',
		'email': 'admin@mydomain.com',
		'isAdmin': true,
		'profile': {
			'first_name': 'Admin',
			'last_name': 'Admin',
			'gender': 'female'
		}
	},
	'team': {
		'Name': "No Team",
		'Public': true,
		'Members': [],
		'Active': true,
	},
	'role': {
		'name': 'No-Permissions'
	},
	'supportEmail': 'support@developerlevel.com'
}

if (typeof Meteor.settings.public == "undefined") {
  Meteor.settings.public = { };
}
if (typeof Meteor.settings.public.Pages == "undefined") {
  Meteor.settings.public.Pages = {
    Base: {
      URL: "http://developerlevel.com/wp-json/wp/v2/pages/",
      Password: "",
      Context: "view",
      CacheTTL: 3660
    },
    "GRF_URL" : "http://stage.developerlevel.com/grf/"
  };
}

export { Defaults };
