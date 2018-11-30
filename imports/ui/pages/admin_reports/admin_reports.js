import './admin_reports.html'
import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import { Report, Reports } from '/imports/api/reports/reports.js';

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

})
