import "./custom_report_triage.html";
import { Template } from "meteor/templating";
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Reports } from '/imports/api/reports/reports.js'



//Template.custom_report_triage.onCreated(function () {
//    this.autorun(() => {
//        if (Roles.subscription.ready()) {
//            if (!Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
//                FlowRouter.redirect('/notfound');
//            }
//        }
//        // sub to reports
//        reportSub(this)
//        this.reportTitle = FlowRouter.getParam("title")
//        // console.log(this.reportTitle)
//        this.getReport = (reportTitle) => Reports.findOne({ title: reportTitle })
//        this.report = this.getReport(this.reportTitle)
//        console.log(this.report)  
//
//        // Meteor.call('updateMBTIReport')
//    })
//})

Template.custom_report_triage.helpers({
    titleIsQnaireMbti () {
        isQnaireMbti = false;
        reportTitle = FlowRouter.getParam("title");
        if (reportTitle == 'qnaireMbti') {
            isQnaireMbti = true;
        }
        return isQnaireMbti;
    }
});