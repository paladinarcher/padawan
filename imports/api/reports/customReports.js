import { Report, Reports } from "./reports.js";
import { User, Users } from "../users/users.js";
import { QRespondent,QQuestionData } from '/imports/api/qnaire_data/qnaire_data.js';

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

class qnaireMbtiReport  {

    constructor() {
        this.mbtiReport = new Report()
        this.userData = User.find().fetch()
        this.mbtiReport.reportData = { all: [] }
        this.mbti = Reports.findOne({title: 'qnaireMbti'})
    }

    createQnaireMBTIReport() {
        this.userData.forEach(u => {
            let reportRespId = 'none'
            if (u.MyProfile.QnaireResponses !== undefined) {
                u.MyProfile.QnaireResponses.forEach((response) => {
                    let tempQresp = QRespondent.findOne({_id: response});
                    // 5c9544d9baef97574 is the qnaire id of the mbti qnaire
                    if (tempQresp !== undefined && tempQresp.qnrid === '5c9544d9baef97574') {
                        reportRespId = response;
                    }
                })
            }
            console.log('this mbti report: ', this);
                
            this.mbtiReport.reportData.all.push({
                userName: u.MyProfile.firstName + ' ' + u.MyProfile.lastName,
                //personality: u.MyProfile.UserType.Personality,
                mbtiQRespId: reportRespId,
            })
        })
        return this.mbtiReport
    }

    addQnaireMBTIReport () {
        let newMBTIReport = new Reports({
            title: 'qnaireMbti',
            description: 'qnaire MBTI Results for all team members',
            dateCreated: new Date(),
            custom: true,
            data: this.createQnaireMBTIReport()
        })
        newMBTIReport.save();
    }

    updateQnaireMBTIReport () {
        Reports.update(this.mbti._id, {
            title: 'qnaireMbti',
            description: 'Qnaire MBTI Results for all team members',
            dateCreated: new Date(),
            custom: true,
            data: this.createQnaireMBTIReport()
        })
    }

} 

export { mbtiReport, qnaireMbtiReport }