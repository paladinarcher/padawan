import { Reports, Report } from './reports.js'
import { mbtiReport, qnaireMbtiReport } from './customReports.js';

Meteor.methods({
    // MBTI report
    'addMBTIReport': function () { 
        let mbti = new mbtiReport();
        mbti.addMBTIReport();
    },
    'updateMBTIReport': function () { 
        let currentMBTI = Reports.findOne({title: 'Legacy Trait Spectrum'})
        let newMBTI = new mbtiReport()
        if(currentMBTI) {
            return Reports.update(currentMBTI._id, {
                title: 'Legacy Trait Spectrum',
                description: 'Legacy Trait Spectrum Results for all team members',
                dateCreated: new Date(),
                custom: true,
                data: newMBTI.createMBTIReport()
            })
        }
        return false;
    },
    // Qnaire MBTI report
    'addQnaireMBTIReport': function () { 
        let qnaireMbti = new qnaireMbtiReport();
        qnaireMbti.addQnaireMBTIReport();
    },    
    'updateQnaireMBTIReport': function () { 
        let currentMBTI = Reports.findOne({title: 'Trait Spectrum'})
        let newMBTI = new qnaireMbtiReport()
        return Reports.update(currentMBTI._id, {
            title: 'Trait Spectrum',
            description: 'Trait Spectrum Results for all team members',
            dateCreated: new Date(),
            custom: true,
            data: newMBTI.createQnaireMBTIReport()
        })
    },

})