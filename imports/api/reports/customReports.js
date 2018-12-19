import { Report, Reports } from "./reports.js";
import { User, Users } from "../users/users.js";

function addMBTIReport () {

    /**
     * @name createMBTIReport
     * @description builds the MBTI Report
     * @param {*} params 
     */
    function createMBTIReport(params) {

        let u = User.find().fetch();
        let mbtiReport = new Report()

        mbtiReport.reportData = {
            all: []
        }

        let allUserData = mbtiReport.reportData.all

        u.forEach((m) => {
            allUserData.push({
                userName: m.MyProfile.firstName + ' ' + m.MyProfile.lastName,
                personality: m.MyProfile.UserType.Personality,
            })
        })

        return mbtiReport;
    }

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
