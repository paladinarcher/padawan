import './report_default.html'
import { Template } from 'meteor/templating'
// import { Meteor } from 'meteor/meteor'
import { Report, Reports } from '/imports/api/reports/reports.js'
import { FlowRouter } from 'meteor/kadira:flow-router'
// import { ReactiveVar } from 'meteor/reactive-var'


/**
 * Functions 
 */

/**
 * converts an object into an array of name and value objects for iterability on the client side
 * ref: https://stackoverflow.com/questions/15035363/meteor-and-handlebars-each-to-iterate-over-object
 * @param  {Object} obj     object to be converted into an array of name, value objects
 * @return {Array}  result  an array of objects with {name, value} params
 */
function arrayify(obj) {
    var result = []
    for (var key in obj) result.push({ name: key, value: obj[key] })
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
 * Events/Helpers
 */

const reportDefaultTempHelpers = {
    reportTitle() {
        const r = Template.instance().report
        const rTitle = r.title;
        return rTitle
    },
    reportDate() {
        const r = Template.instance().report
        const rDate = r.dateCreated;
        return rDate
    },
    reportData() {
        const r = Template.instance().report
        const rData = r.data
        return r.data.reportData
    },
    ifObject(val) {
        console.log(val.hash.val)
        console.log(val)
        // the value is an object, return true
        if (typeof (val.hash.val) == 'object') {
            return true
        }
        // The value is not an object, return false
        else {
            return false
        }
        // for some reason the if statement wasn't hit. Return false as a default
        return false
    },
    convertObj(val) {
        return JSON.stringify(val.hash.val)
    },
    iterateObj(val) {
        console.log(val)
        const originalObj = val.hash.val;

        console.log(`Object to Iterate:  ${originalObj}`)
        console.log(`Object to Iterate:  ${val.hash.val}`)
        return val
    }
}


/**
 * Main
 */

// register arrayify as a global template helper
Template.registerHelper('arrayify', arrayify)

// default reports onCreated actions
Template.report_default.onCreated(function () {
    this.autorun(() => {
        if (Roles.subscription.ready()) {
            if (!Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
                FlowRouter.redirect('/notfound');
            }
        }
        // sub to reports
        reportSub(this)
        // set flowrouter id param to the report selected
        this.reportId = FlowRouter.getParam("_id")
        // get the report selected from the db
        this.getReport = (reportId) => Reports.findOne({ _id: reportId })
        // store selected report as param
        this.report = this.getReport(this.reportId)
    })
})

// set default report template helpers
Template.report_default.helpers(reportDefaultTempHelpers)