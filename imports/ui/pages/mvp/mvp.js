import './mvp.html';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { QRespondent,QQuestionData } from '/imports/api/qnaire_data/qnaire_data.js';
import { Session } from 'meteor/session';

const TMP_PP = new ReactiveVar();
const TS = new ReactiveVar();
const PG = new ReactiveVar(0);
const EX = new ReactiveVar(false);
const LoggedIn = new ReactiveVar(false);
async function get_pp(v, callback = function(){}) {
    let pp = await Meteor.call('tmp_pp', v, function(error, result){
        if(error){
            console.log('ERROR',error);
        }else{
            //console.log('RESULT',result);
            TMP_PP.set(result[0]);
            EX.set(result[1]);
            callback();
            return result;
        }
     });
    return pp;
}
async function find_trait_specturm() {
    let q = await Meteor.call('find_trait_spectrum', function(error, result) {
        if(error){
            console.log('ERROR',error);
        }else{
            console.log('RESULT',result);
            Session.set('TS',result);
            let uId = Meteor.userId();
            if(uId) {
                LoggedIn.set(true);
            }
        }
    });
}

function findQResp (thisQnrid) {
	let uid = Meteor.userId();
    let u = Meteor.users.findOne({_id:uid});
	let responses = u.MyProfile.QnaireResponses;
	let returnQresp = "no qrespondent";
	let tempQresp = "-1";
	if (responses != undefined && responses.constructor === Array) {
		responses.forEach(function (element, index) {
			tempQresp = QRespondent.findOne({_id: responses[index]});
			// console.log("tqr: ", tempQresp);
			// console.log("thisQnrid: ", thisQnrid);
			if (tempQresp != undefined && tempQresp.qnrid == thisQnrid) {
				returnQresp = tempQresp;
			}
		});
	}
	// console.log("returnQresp: ", returnQresp);
	return returnQresp;
}

async function greaterThanMinimum() {
    qnaire = Session.get('TS');
    console.log('TS',qnaire);
    min = 1;
    overMinimum = false;
    if (qnaire.minimum >= 0) {
        min = qnaire.minimum
    }
    console.log('Min',min);
    let userId = Meteor.userId();
    let qresp = await findQResp(qnaire._id);
    console.log('qresp',qresp);
    if (userId && qresp != "no qrespondent") {
        console.log('Answered',qresp.responses.length);
        let answered = qresp.responses.length;
        let page = answered;
        if (page > 0) {
            page = Math.floor((page/qnaire.qqPerPage)+1);
        }
        Session.set('PG',page);
        console.log('Page',Session.get('PG'));
        
        if (answered >= min) {
            overMinimum = true;
        }
    }
    return overMinimum;
}

async function get_trait_spectrum() {
    let done = await greaterThanMinimum();
    console.log('done',done);
    if(!done) {
        $('#myModal').modal('show');
    }
}

Template.mvp_register.onCreated(function() {
    this.autorun(() => {
        this.subscription2 = this.subscribe("userList", this.userId, {
            onStop: function() {
                console.log("User List subscription stopped! ", arguments, this);
            },
            onReady: function() {
                console.log("User List subscription ready! ", arguments, this);
                find_trait_specturm()
            }
        });
    });
});

Template.mvp_register.helpers({
    trait_spectrum() {
        get_trait_spectrum();
    },
    is_logged_in() {
        return LoggedIn.get();
    },
    ts_id() {
        let ts = Session.get('TS');
        if(ts) {
            return ts._id;
        }
        return false;
    },
    page() {
        return Session.get('PG');
    }
});

Template.mvp_register.events({
    'submit #mvpRegister': async function(event, instance) {
        event.preventDefault();
        let val = $('#registerEmail').val();
        await get_pp(val, function() {
            let pass = TMP_PP.get();
            let exists = EX.get();
            console.log('Submit',val,pass);
            Meteor.loginWithPassword(val,pass, function(e) {
                if(e) {
                    console.log('Error',e);
                    if(exists) {
                        $('#pwModal').modal('show');
                    }
                } else {
                    console.log('User',Meteor.userId());
                    LoggedIn.set(true);
                }
            });
        });
    }
});