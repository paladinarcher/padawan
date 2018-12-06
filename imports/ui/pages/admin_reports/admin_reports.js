import './admin_reports.html'
import {Template} from 'meteor/templating'
import {Meteor} from 'meteor/meteor'
import {Report, Reports} from '/imports/api/reports/reports.js'
import {FlowRouter} from 'meteor/kadira:flow-router'
import {ReactiveVar} from 'meteor/reactive-var'


/**
 * Functions
 */

/**
 * converts an object into an array of name and value objects for iterability on the client side
 * ref: https://stackoverflow.com/questions/15035363/meteor-and-handlebars-each-to-iterate-over-object
 * @param  {Object} obj     object to be converted into an array of name, value objects
 * @return {Array}  result  an array of objects with {name, value} params
 */
function arrayify (obj) {
    var result = []
    for (var key in obj) result.push({name:key,value:obj[key]})
    return result
}

/**
 * displays console messages on sub stop
 * @return {Boolean} returns false on completion
 */
function stopMsgs() {
    console.log(`MESSAGE:  Subscription stopped!`);
    console.log(`ARGS:  ${arguments}`);
    console.log(`THIS:  ${this}`);
    return false
}

/**
 * displays console messages on sub ready
 * @return {Boolean} returns false on completion
 */
function readyMsgs() {
    console.log(`MESSAGE:  Subscription Ready!`);
    console.log(`ARGS:  ${arguments}`);
    console.log(`THIS:  ${this}`);
    return false
}

/**
 * subs the template to the reports publication
 * @param   {Object}  self   Template instance (referred to below as 'this')
 * @return  {Boolean}        Return false by default (no other value needs to be returned)
 */
function reportSub(self) {
    // subscribe to the reports db
    self.subscription = self.subscribe('reports', {
        onStop: stopMsgs(),
        onReady: readyMsgs()
    })
    return false
}


/**
 * Helpers and Events
 */

const adminReportsTempHelpers = {
    // return all the reports from the reports db
    reports() {
        console.log('Reports: ', Reports.find({}))
        return Reports.find({})
    },
    // format the id of the title in the panel to have the report ID
    titleFormat(reportId) {
        const reportTitle = Reports.find({reportId})
        return reportTitle.data.title
                .toString().trim(' ').join('-')
    },
    reportDate(r) {
        const rDate = r.dateCreated
        const rDateString  = rDate.toLocaleDateString("en-US")
        console.log(typeof(rDateString))
        console.log(rDateString)
    }
}

const adminReportsTempEvents = {
    'click a.report-title' (event, instance) {
        // grab report id for url
        console.log(event.target.dataset.loc)
        const reportLocation = event.target.dataset.loc

        // navigate to the report by id
        FlowRouter.go(`/tools/reports/${reportLocation}`)
    }
}

const reportDefaultTempHelpers = {
    reportTitle () {
        const r = Template.instance().report
        const rTitle = r.title;
        return rTitle
    },
    reportDate () {
        const r = Template.instance().report
        const rDate = r.dateCreated;
        return rDate
    },
    reportData () {
        const r = Template.instance().report
        const rData = r.data
        return r.data.reportData
    },
    ifObject (val) {
        console.log(val.hash.val)
        console.log(val)
        // the value is an object, return true
        if (typeof(val.hash.val) == 'object') {
            return true
        }
        // The value is not an object, return false
        else {
            return false
        }
        // for some reason the if statement wasn't hit. Return false as a default
        return false
    },
    convertObj (val) {
        return JSON.stringify(val.hash.val)
    }
}

/**
 * Main
 */

// register arrayify as a global template helper
Template.registerHelper('arrayify', arrayify)


// onCreated actions for admin report template
Template.admin_reports.onCreated(function reportSubs() {
    this.autorun(() => reportSub(this))
})
// set  admin_report helpers
Template.admin_reports.helpers(adminReportsTempHelpers)
// set admin_report temp events
Template.admin_reports.events(adminReportsTempEvents)


// default reports onCreated actions
Template.report_default.onCreated(function () {
    this.autorun(() => {
        // sub to reports
        reportSub(this)
        // set flowrouter id param to the report selected
        this.reportId = FlowRouter.getParam("_id")
        // get the report selected from the db
        this.getReport = (reportId) => Reports.findOne({_id:reportId})
        // store selected report as param
        this.report = this.getReport(this.reportId)
    })
})
// set default report template helpers
Template.report_default.helpers(reportDefaultTempHelpers)
