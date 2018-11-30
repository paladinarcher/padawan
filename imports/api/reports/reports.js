import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { Class } from 'meteor/jagi:astronomy'

/**
 * Class to hold the report data
 * @param reportData {Object} - object containing the data for each report
 */
const Report = Class.create({
    name: 'Report',
    fields: {
        reportData: {
            type: Object,
        }
    }
})


/**
 * Class to hold the report metadata and the report object
 * @param {String} reportTitle  - report title information
 * @param {String} description  - report desc
 * @param {string} url - url param information
 * @param {Report<Object>} data - report data
 */
const Reports = Class.create({
    name: 'Reports',
    collection: new Mongo.Collection('reports'),
    fields: {
        title: {
            type: String,
            default: 'New Report'
        },
        description: {
            type: String,
            default: 'default description for a report'
        },
        url: {
            type: String,
            default: 'not-found'
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

// export modules here
export {Report, Reports}
