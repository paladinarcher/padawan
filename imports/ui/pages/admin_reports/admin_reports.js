import './admin_reports.html'
import {Template} from 'meteor/templating'
import {Meteor} from 'meteor/meteor'
import {Reports} from '/imports/api/reports/reports.js'
import {FlowRouter} from 'meteor/kadira:flow-router'
import { mbtiReport, qnaireMbtiReport } from '/imports/api/reports/customReports.js'


/******************
 *    Functions   *
 *****************/

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


/**********************
 * Helpers and Events *
 *********************/


const adminReportsTempHelpers = {
    // return all the reports from the reports db
    reports () {
        console.log('Reports: ', Reports.find({}))
        return Reports.find({})
    },
    // format the id of the title in the panel to have the report ID
    titleFormat (reportId) {
        const reportTitle = Reports.find({reportId})
        return reportTitle.data.title
                .toString().trim(' ').join('-')
    },
    reportDate (r) {
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
        const reportIsCustom = (event.target.dataset.custom === 'true') ? true : false  
        const reportTitle = event.target.dataset.title
        if (reportIsCustom) { 
            // update to latest mbti report if the custom report selected is the mbti report 
            if (reportTitle == 'mbti') {
                Meteor.call('updateMBTIReport')
            }
            // go to custom report by name 
            FlowRouter.go(`/tools/reports/custom/${reportTitle}`)
        } else {
            // else navigate to the report by id
            FlowRouter.go(`/tools/reports/${reportLocation}`)
        }
    },
    'click a#weak-responses-link' (event, instance) {
        FlowRouter.go('/reports/weakResponses');
    },
    'click a#opposite-responses-link' (event, instance) {
        FlowRouter.go('/reports/oppositeResponses');
    },
    'click button#updateCustomMbtiReports' (event, instance) {
        // test for mbti report existence and add it if it doesn't exist
        if (Reports.findOne({ title: 'mbti' })) {
            console.log('the mbti report exists');
            Meteor.call('updateMBTIReport');
        } else {
            console.log('adding mbti report')
            Meteor.call('addMBTIReport');
        }
        // test for qnaireMbti report existence and add it if it doesn't exist
        if (Reports.findOne({ title: 'qnaireMbti' })) {
            console.log('the qnaireMbti report exists');
            Meteor.call('updateQnaireMBTIReport');
        } else {
            console.log('adding qnaireMbti report')
            Meteor.call('addQnaireMBTIReport');
            let qnaireMbti = new qnaireMbtiReport();
            qnaireMbti.addQnaireMBTIReport();
        }
    }
}


/**********************
 *        Main        *
 *********************/

// register arrayify as a global template helper
Template.registerHelper('arrayify', arrayify)


// onCreated actions for admin report template
Template.admin_reports.onCreated(function reportSubs() {
    this.autorun( () => {
        if (Roles.subscription.ready()) {
            if (!Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
                FlowRouter.redirect('/notfound');
            }
        }
        reportSub(this)
    })
})
// set  admin_report helpers
Template.admin_reports.helpers(adminReportsTempHelpers)
// set admin_report temp events
Template.admin_reports.events(adminReportsTempEvents)


