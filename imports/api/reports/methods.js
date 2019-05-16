import { Reports, Report } from './reports.js'
import { mbtiReport } from './customReports.js';

Meteor.methods({
    'updateMBTIReport': function () { 
        let currentMBTI = Reports.findOne({title: 'mbti'})
        let newMBTI = new mbtiReport()
        return Reports.update(currentMBTI._id, {
            title: 'mbti',
            description: 'MBTI Results for all team members',
            dateCreated: new Date(),
            custom: true,
            data: newMBTI.createMBTIReport()
        })
    }
})