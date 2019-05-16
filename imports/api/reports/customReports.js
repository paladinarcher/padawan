import { Report, Reports } from "./reports.js";
import { User, Users } from "../users/users.js";

class mbtiReport  {

    constructor() {
        this.mbtiReport = new Report()
        this.userData = User.find().fetch()
        this.mbtiReport.reportData = { all: [] }
        this.mbti = Reports.findOne({title: 'mbti'})
    }

    createMBTIReport() {
        this.userData.forEach(u => {
            this.mbtiReport.reportData.all.push({
                userName: u.MyProfile.firstName + ' ' + u.MyProfile.lastName,
                personality: u.MyProfile.UserType.Personality,
            })
        })
        return this.mbtiReport
    }

    addMBTIReport () {
        let newMBTIReport = new Reports({
            title: 'mbti',
            description: 'MBTI Results for all team members',
            dateCreated: new Date(),
            custom: true,
            data: this.createMBTIReport()
        })
        newMBTIReport.save();
    }

    updateMBTIReport () {
        Reports.update(this.mbti._id, {
            title: 'mbti',
            description: 'MBTI Results for all team members',
            dateCreated: new Date(),
            custom: true,
            data: this.createMBTIReport()
        })
    }

} 

export { mbtiReport }