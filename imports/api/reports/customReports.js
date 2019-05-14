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
            let reportPersonality = 'none'
            if (u.MyProfile.QnaireResponses !== undefined) {
                u.MyProfile.QnaireResponses.forEach((response) => {
                    let tempQresp = QRespondent.findOne({_id: response});
                    // 5c9544d9baef97574 is the qnaire id of the mbti qnaire
                    if (tempQresp !== undefined && tempQresp.qnrid === '5c9544d9baef97574') {
                        reportRespId = response;
                    }
                });
                let mbtiResp = QRespondent.findOne({_id: reportRespId});
                let ieTotal, nsTotal, tfTotal, jpTotal, ieCount, nsCount, tfCount, jpCount, ieValue, nsValue, tfValue, jpValue;
                if (mbtiResp !== undefined) {
                    // Counts
                    ieCount = mbtiResp.responses.find((response) => {
                        return response.qqLabel === '_IE_count';
                    });
                    nsCount = mbtiResp.responses.find((response) => {
                        return response.qqLabel === '_NS_count';
                    });
                    tfCount = mbtiResp.responses.find((response) => {
                        return response.qqLabel === '_TF_count';
                    });
                    jpCount = mbtiResp.responses.find((response) => {
                        return response.qqLabel === '_JP_count';
                    });
                    // Totals
                    ieTotal = mbtiResp.responses.find((response) => {
                        return response.qqLabel === '_IE';
                    });
                    nsTotal = mbtiResp.responses.find((response) => {
                        return response.qqLabel === '_NS';
                    });
                    tfTotal = mbtiResp.responses.find((response) => {
                        return response.qqLabel === '_TF';
                    });
                    jpTotal = mbtiResp.responses.find((response) => {
                        return response.qqLabel === '_JP';
                    });
                }

                // setting counts
                if (ieCount !== undefined) {
                    ieCount = ieCount.qqData;
                } else {
                    ieCount = 0;
                }
                if (nsCount !== undefined) {
                    nsCount = nsCount.qqData;
                } else {
                    nsCount = 0;
                }
                if (tfCount !== undefined) {
                    tfCount = tfCount.qqData;
                } else {
                    tfCount = 0;
                }
                if (jpCount !== undefined) {
                    jpCount = jpCount.qqData;
                } else {
                    jpCount = 0;
                }

                // setting totals
                if (ieTotal !== undefined) {
                    ieTotal = ieTotal.qqData;
                } else {
                    ieTotal = 'N/A';
                }
                if (nsTotal !== undefined) {
                    nsTotal = nsTotal.qqData;
                } else {
                    nsTotal = 'N/A';
                }
                if (tfTotal !== undefined) {
                    tfTotal = tfTotal.qqData;
                } else {
                    tfTotal = 'N/A';
                }
                if (jpTotal !== undefined) {
                    jpTotal = jpTotal.qqData;
                } else {
                    jpTotal = 'N/A';
                }

                // setting values
                if (ieCount !== 0) {
                    ieValue = ieTotal / ieCount;
                } else {
                    ieValue = 'N/A'
                }
                if (nsCount !== 0) {
                    nsValue = nsTotal / nsCount;
                } else {
                    nsValue = 'N/A'
                }
                if (tfCount !== 0) {
                    tfValue = tfTotal / tfCount;
                } else {
                    tfValue = 'N/A'
                }
                if (jpCount !== 0) {
                    jpValue = jpTotal / jpCount;
                } else {
                    jpValue = 'N/A'
                }

                console.log('mbtiResp', mbtiResp);
                reportPersonality = {
                    IE: {
                        QuestionCount: ieCount,
                        Totals: ieTotal,
                        Value: ieValue,
                    },
                    NS: {
                        QuestionCount: nsCount,
                        Totals: nsTotal,
                        Value: nsValue,
                    },
                    TF: {
                        QuestionCount: tfCount,
                        Totals: tfTotal,
                        Value: tfValue,
                    },
                    JP: {
                        QuestionCount: jpCount,
                        Totals: jpTotal,
                        Value: jpValue,
                    },
                }
            }
            //console.log('this mbti report: ', this);
                
            this.mbtiReport.reportData.all.push({
                userName: u.MyProfile.firstName + ' ' + u.MyProfile.lastName,
                //personality: u.MyProfile.UserType.Personality,
                personality: reportPersonality,
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