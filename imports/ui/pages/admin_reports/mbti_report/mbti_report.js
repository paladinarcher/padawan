import "./mbti_report.html";
import { Template } from "meteor/templating";
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Reports } from '/imports/api/reports/reports.js'

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
 * Helpers/Events
 */

const mbti_helpers = {
    // r: Template.instance().report,
    reportDate() {
        const r = Template.instance().report
        console.log('r: ', r);
        console.log('Template.instance(): ', Template.instance());
        return r.dateCreated
    },
    allUsers () {
        const r = Template.instance().report
        return r.data.reportData.all
    }
}
const mbti_events = {
    'click .graph-mbti': function (event, instance) {
        console.log(event)
    },
    'mouseenter .hover-popover': function (event, instance) {
        if (event.target.dataset.hover == 'disabled') {
            console.log('hovering')
        } else {
            return false
        }
    },
    'click .update-report': function updateMbti() {
        Meteor.call('updateMBTIReport')
        location.reload();
    }
}

 /**
 * Main
 */


Template.registerHelper('arrayify', arrayify)

Template.mbti_report.rendered = function tempOnLoad() {
    if (!this._rendered) {
        this._rendered = true
        console.log('template onload')
        Meteor.call('updateMBTIReport')
    }
}

Template.mbti_report.onCreated(function () {
    this.autorun(() => {
        if (Roles.subscription.ready()) {
            if (!Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
                FlowRouter.redirect('/notfound');
            }
        }
        // sub to reports
        reportSub(this)
        this.reportTitle = FlowRouter.getParam("title")
        // console.log(this.reportTitle)
        this.getReport = (reportTitle) => Reports.findOne({ title: reportTitle })
        this.report = this.getReport(this.reportTitle)
        console.log(this.report)  

        // Meteor.call('updateMBTIReport')
    })
})

Template.mbti_report.helpers(mbti_helpers)
Template.mbti_report.events(mbti_events)