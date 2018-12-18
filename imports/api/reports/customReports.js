import { Report, Reports } from "./reports.js";
import { Users } from "../users/users.js";

/**
 * @name createMBTIReport
 * @description builds the MBTI Report
 * @param {*} params 
 */
function createMBTIReport(params) {

    let mbtiReport = new Report()
    
    //TODO: get report data here 
    mbtiReport.reportData = {
        all: []
    }

    let allUserData = mbtiReport.reportData.all

    // test data 
    let testData = {
        userName: 'Test Person',
        personality: {
            IE: {
                values: 0,
                totals: 0,
                questionCount: 0
            },
            NS: {
                values: 0,
                totals: 0,
                questionCount: 0
            },
            TF: {
                values: 0,
                totals: 0,
                questionCount: 0
            },
            JP: {
                values: 0,
                totals: 0,
                questionCount: 0
            }
        }
    }

    // push the data to the array in the report 
    allUserData.push(testData)

    return mbtiReport;
}

function addMBTIReport () {

    let newMBTIReport = new Reports({
        title: 'mbti',
        description: 'MBTI Results for all team members',
        dateCreated: new Date(),
        custom: true,
        data: createMBTIReport()
    })

    newMBTIReport.save();
}


export { addMBTIReport }