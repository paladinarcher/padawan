import { Meteor } from 'meteor/meteor';
import { Reports, Report } from '../reports.js';

Meteor.publish('reports', function reportsPublication () {
	return Reports.find({})
})
