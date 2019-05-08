import { Reports, Report } from './reports.js'
import { mbtiReport, qnaireMbtiReport } from './customReports.js';

Meteor.methods({
    // MBTI report
    'addMBTIReport': function () { 
        let mbti = new mbtiReport();
        mbti.addMBTIReport();
    },
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
    },
    // Qnaire MBTI report
    'updateQnaireMBTIReport': function () { 
        let currentMBTI = Reports.findOne({title: 'mbti'})
        let newMBTI = new mbtiReport()
        return Reports.update(currentMBTI._id, {
            title: 'mbti',
            description: 'MBTI Results for all team members',
            dateCreated: new Date(),
            custom: true,
            data: newMBTI.createMBTIReport()
        })
    },
    'addQnaireMBTIReport': function () { 
        let qnaireMbti = new qnaireMbtiReport();
        qnaireMbti.addQnaireMBTIReport();
    },
})