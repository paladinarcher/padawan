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
    },
    reportDate(r) {
        const rDate = r.dateCreated
        const rDateString  = rDate.toLocaleDateString("en-US")
        console.log(typeof(rDateString))
        console.log(rDateString)
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



// autorun for default report template
Template.report_default.onCreated(function () {
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
        this.reportId = FlowRouter.getParam("_id")
        this.getReport = (reportId) => Reports.findOne({_id:reportId})
        this.report = this.getReport(this.reportId)
        // console.log(this.reportId)
        // console.log(this.report)
    })
})

// // onCreated functions
// Template.report_default.onCreated(function defaultReportOnCreated(){
//     this.reportId = FlowRouter.getParam("_id")
//     this.getReport = (reportId) => Reports.findOne({_id:reportId})
//     this.report = this.getReport(this.reportId)
//     // console.log(this.reportId)
//     // console.log(this.report)
// })

// arrayify obj for use on the client side
// ref: https://stackoverflow.com/questions/15035363/meteor-and-handlebars-each-to-iterate-over-object
Template.registerHelper('arrayify',function(obj){
    var result = [];
    for (var key in obj) result.push({name:key,value:obj[key]});
    return result;
});


// default report template helpers
Template.report_default.helpers({
    reportTitle () {
        const r = Template.instance().report
        const rTitle = r.title;
        return rTitle
    },
    reportDate () {
        const r = Template.instance().report
        const rDate = r.dateCreated;
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }

        return rDate
    },
    reportData () {
        const r = Template.instance().report
        const rData = r.data
        return r.data.reportData
    }
});
