import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import {Random} from 'meteor/random'
import {Class} from 'meteor/jagi:astronomy'


const ConfidenceRubric = {
	'0': {
		prompt: 'unfamilar',
		value: 0
	},
	'1': {
		prompt: 'a month or more',
		value: 1
	},
	'2': {
		prompt: 'a week or two',
		value: 2
	},
	'3': {
		prompt: 'a couple of days',
		value: 3
	},
	'4': {
		prompt: '8 to 10 hours',
		value: 4
	},
	'5': {
		prompt: 'a couple of hours',
		value: 5
	},
	'6': {
		prompt: 'I could architect and give detailed technical leadership to a team today',
		value: 6
	}
}


export { ConfidenceRubric }