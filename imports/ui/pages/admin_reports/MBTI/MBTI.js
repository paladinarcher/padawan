import "./MBTI.html";
import { Template } from "meteor/templating";
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Report, Reports } from '/imports/api/reports/reports.js'


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

const mbti_helpers = {}
const mbti_events = {}

 /**
 * Main
 */


Template.registerHelper('arrayify', arrayify)


Template.mbti_report.onCreated(function () {
    this.autorun(() => {

        // sub to reports
        reportSub(this)

        // set flowrouter name param to the report selected
        this.reportName = FlowRouter.getParam("title")
        
        // get the report selected from the db

        
        // store selected report as param
    })
})

Template.mbti_report.helpers(mbti_helpers)
Template.mbti_report.events(mbti_events)