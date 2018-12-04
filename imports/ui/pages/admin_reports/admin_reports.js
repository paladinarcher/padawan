import './admin_reports.html'
import {Template} from 'meteor/templating'
import {Meteor} from 'meteor/meteor'
import {Report, Reports} from '/imports/api/reports/reports.js'
import {FlowRouter} from 'meteor/kadira:flow-router'
import {ReactiveVar} from 'meteor/reactive-var'

// onCreated
Template.admin_reports.onCreated(function () {
    this.autorun(() => {
        // subscribe to the reports db
        this.subscription = this.subscribe('reports', {
            onStop: function () {
                console.log(`MESSAGE:  Subscription stopped!`);
                console.log(`ARGS:  ${arguments}`);
                console.log(`THIS:  ${this}`);
            },
            onReady: function () {
                // console.log("Subscription ready! ", arguments, this);
                console.log(`MESSAGE:  Subscription Ready!`);
                console.log(`ARGS:  ${arguments}`);
                console.log(`THIS:  ${this}`);
            }
        })
    })
})


// helpers
Template.admin_reports.helpers({
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
    }
})

// events
Template.admin_reports.events({
    'click a.report-title' (event, instance) {
        // grab report id for url
        console.log(event.target.dataset.loc)
        const reportLocation = event.target.dataset.loc

        // navigate to the report by id
        FlowRouter.go(`/tools/reports/${reportLocation}`)
    }
})



// default report template js
Template.report_default.onCreated(function () {
    this.report = new ReactiveVar()
    this.autorun(() => {
        // subscribe to the reports db
        this.subscription = this.subscribe('reports', {
            onStop: function () {
                console.log(`MESSAGE:  Subscription stopped!`);
                console.log(`ARGS:  ${arguments}`);
                console.log(`THIS:  ${this}`);
            },
            onReady: function () {
                // console.log("Subscription ready! ", arguments, this);
                console.log(`MESSAGE:  Subscription Ready!`);
                console.log(`ARGS:  ${arguments}`);
                console.log(`THIS:  ${this}`);
            }
        })
    })
})

// default report template helpers
Template.report_default.helpers({
    getReport () {
        const reportId = FlowRouter.getParam("_id")
        const report = Reports.find({reportId})
        this.report = report
    }
});
