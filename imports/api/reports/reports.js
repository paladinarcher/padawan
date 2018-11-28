import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

const Report = Class.create({
    name: 'Report', 
    fields: {
        title: {
            type: String, 
        }, 
        reportData: {
            type: Object, 
        }
    }
})

const Reports = Class.create({
    name: 'Reports',
    collection: new Mongo.Collection('reports'),
    fields: {
        name: {
            type: String, 
            default: 'New Report'
        },
        description: {
            type: String, 
            default: 'default description for a report'
        },
        url: {
            type: String,
            default: '/not-found'
        }, 
        data: {
            type: Report
        }
    },
    // TODO: add helper functions
    helpers: {
        // addReport()
        // removeReport()
        // viewAllReports()
        // viewReportById()
        // viewReportByName()
    },
    // TODO: Add update method 
    meteorMethods: {
        // update()
    }
})

export { Report, Reports }
