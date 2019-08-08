import { Class, Union, Enum} from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';
import { MyersBriggsCategory, Question } from '../questions/questions.js';
import { Category, CategoryManager } from '../categories/categories.js';
import { Defaults } from '../../startup/both/defaults.js';
import { Team } from '../teams/teams.js';
import { UserSegment } from '../user_segments/user_segments.js';
import { QQMixedType } from '../qnaire_data/qnaire_data.js';


const MyersBriggsBit = Class.create({
    name: 'MyersBriggsBit',
    fields: {
        Value: {
            type: Number,
            default: 0
        },
        Totals: {
            type: Number,
            default: 0
        },
        QuestionCount: {
            type: Number,
            default: 0
        }
    },
    helpers: {
        addValue(value) {
            this.Totals += value;
            this.QuestionCount ++;
            this.Value = (this.QuestionCount == 0 ? 0 :this.Totals / this.QuestionCount);
        },
        removeValue(value) {
            this.QuestionCount --;
            if(this.QuestionCount < 0) { this.QuestionCount = 0; }
            if(this.QuestionCount == 0) { this.Totals = this.Value = 0; return; }
            this.Totals -= value;
            this.Value = this.Totals / this.QuestionCount;
        },
        reset() {
            this.Totals = 0;
            this.QuestionCount = 0;
            this.Value = 0;
        }
    }
});
const MyersBriggs = Class.create({
    name: 'MyersBriggs',
    fields: {
        IE: {
            type: MyersBriggsBit,
            default: function () { return new MyersBriggsBit(); }
        },
        NS: {
            type: MyersBriggsBit,
            default: function () { return new MyersBriggsBit(); }
        },
        TF: {
            type: MyersBriggsBit,
            default: function () { return new MyersBriggsBit(); }
        },
        JP: {
            type: MyersBriggsBit,
            default: function () { return new MyersBriggsBit(); }
        }
    },
    helpers: {
        addByCategory(category, value) {
            console.log(category, value);
            let name = this.getIdentifierById(category);
            this[name].addValue(value);
        },
        removeByCategory(category, value) {
            let name = this.getIdentifierById(category);
            this[name].removeValue(value);
        },
        getIdentifierById(categoryId) {
            if(categoryId === 0) { return 'IE'; }
            if(categoryId === 1) { return 'NS'; }
            if(categoryId === 2) { return 'TF'; }
            return 'JP';
        },
        getFourLetter() {
            let IEL = (this.IE.Value === 0 ? '_' : (this.IE.Value < 0 ? 'I' : 'E'));
            let NSL = (this.NS.Value === 0 ? '_' : (this.NS.Value < 0 ? 'N' : 'S'));
            let TFL = (this.TF.Value === 0 ? '_' : (this.TF.Value < 0 ? 'T' : 'F'));
            let JPL = (this.JP.Value === 0 ? '_' : (this.JP.Value < 0 ? 'J' : 'P'));
            return `${IEL}${NSL}${TFL}${JPL}`;
        },
        reset() {
            for(let i = 0; i < 4; i++) {
                this[this.getIdentifierById(i)].reset();
            }
        }
    }
});

// QnaireAnswer was used when qnaires were put in Users.MyProfile.UserType
const QnaireAnswer = Class.create({
	name: 'QnaireAnswer',
	fields: {
		label: {
			type: String,
			default: ''
		},
		question: {
			type: String,
			default: 'No question'
		},
		answers: {
			type: QQMixedType,
			default: ['No', ' answers']
		}
	}
});
const Answer = Class.create({
    name: 'Answer',
    fields: {
        Category: {
            type:MyersBriggsCategory,
            default:0
        },
        Categories: {
            type: [MyersBriggsCategory],
            default: []
        },
        QuestionID: {
            type: String,
            default:''
        },
        Reversed: {
            type: Boolean,
            default:false
        },
        Value: {
            type: Number,
            default:0
        },
        AnsweredAt: {
            type: Date,
            default: function () { return new Date(); }
        }
    },
    helpers: {
        getQuestion() {
            let q = Question.findOne({_id:this.QuestionID});
            return q;
        },
        unanswer() {
            this.getQuestion().removeAnswer(this);
        }
    }
});
// UserQnaire was used when qnaires were put in Users.MyProfile.UserType
const UserQnaire = Class.create({
	name: 'UserQnaire',
	fields: {
		QnaireId: {
			type: String,
			default: "-1"
		},
		QnaireAnswers: {
			type: [QnaireAnswer],
			default: []
		}
	},
    helpers: {
        setAnswer(myLabel, myQuestion, myAnswer) {
			function eqLabel(element) {
				return element.label == myLabel;
			}
			qnAnIndex = this.QnairAnswers.findIndex(eqLabel);
			this.QnairAnswers[qnAnIndex].question = myQuestion; 
			//this.QnairAnswers[qnAnIndex].answer = myAnswer; 
        }
	}
});
const UserType = Class.create({
    name: 'UserType',
    fields: {
        Personality: {
            type: MyersBriggs,
            default: function () { return new MyersBriggs(); }
        },
        AnsweredQuestions: {
            type: [Answer],
            default: function() { return []; }
        },
        TotalQuestions: {
            type: Number,
            default:0
        },
		// AnsweredQnaireQuestions was used when qnaires were put in Users.MyProfile.UserType
		AnsweredQnaireQuestions: {
            type: [UserQnaire],
            default: function() { return []; }
		}
    },
    helpers: {
        getAnsweredQuestionsIDs() {
            let qids = [];
            _.each(this.AnsweredQuestions, function (ans) {
                qids.push(ans.QuestionID);
            });
            return qids;
        },
        setTotalQuestions(totalQuestions) {
            //console.log("user.js totalQuestions", totalQuestions);
            this.TotalQuestions = totalQuestions;
            //console.log("user.js totalQuestions2", this.TotalQuestions);
        },
        getTotalQuestions() {
          return this.TotalQuestions;
        },
        answerQuestion(answer) {
            this.AnsweredQuestions.push(answer);
            console.log(this.AnsweredQuestions);
            console.log(answer.Categories);
            let contextThis = this;
            _.each(answer.Categories, function (cat) {
                contextThis.Personality.addByCategory(cat, answer.Value);
            });
            //this.Personality.addByCategory(answer.Category, answer.Value);
        },
        unAnswerQuestion(answer, skipSlice) {
            let index = this.getAnswerIndexForQuestionID(answer.QuestionID);
            let before = this.AnsweredQuestions.length;

            if(index < 0) { return; }
            console.log(index);
            if(!skipSlice) {
                if(index == 0) {
                    this.AnsweredQuestions.shift();
                } else if(index == this.AnsweredQuestions.length - 1) {
                    this.AnsweredQuestions.pop();
                } else {
                    this.AnsweredQuestions = this.AnsweredQuestions.slice(0,index).concat(this.AnsweredQuestions.slice(index+1));
                }
            }
            answer.unanswer();
            _.each(answer.Categories, function (cat) {
                this.Personality.removeByCategory(cat, answer.Value);
            });
            //this.Personality.removeByCategory(answer.Category, answer.Value);
            console.log("User Answer Count: "+before+" => "+this.AnsweredQuestions.length);
        },
		getQnaire(qnid) {
			thisQn = {};
			this.AnsweredQnaireQuestions.forEach(function (value, index) {
				if (value.QnaireId == qnid) {
					thisQn = value;
				}
			});
			return thisQn;
		},
        getAnswerIndexForQuestionID(questionId) {
            for(let i = 0; i < this.AnsweredQuestions.length; i++) {
                if(this.AnsweredQuestions[i].QuestionID == questionId) { return i; }
            }
            return -1;
        },
        getAnswerForQuestion(questionId) {
            return _.find(this.AnsweredQuestions, function (ans, i) {
                return ans.QuestionID == questionId;
            });
        },
        reset() {
            let self = this;
            _.each(this.AnsweredQuestions, function (ans) {
                self.unAnswerQuestion(ans, true);
            });
            this.Personality.reset();
            this.AnsweredQuestions = [];
        }
    }
});

const DashboardPane = Class.create({
    name: 'DashboardPane',
    fields: {
        size: {
            type: Number,
            default: 4
        },
        name: {
            type: String,
            default: 'App_home'
        },
        title: {
            type: String,
            default: 'Personality Questions'
        },
        route: {
            type: String,
            default: '/'
        }
    }
})

const Profile = Class.create({
  name: 'Profile',
  //collection: new Mongo.Collection('profile'),
  fields: {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    UserType: {
      type: UserType,
      default: function() {
        return new UserType();
      }
    },
    gender: {
      type: Boolean,
      default: false
    },
    birthDate: {
      type: Date,
      optional: true
    },
    Categories: {
      type: CategoryManager,
      default: function() {
        return CategoryManager.OfType('User');
      }
    },
    dashboardPanes: {
      type: [DashboardPane],
      default: []
    },
    segments: {
      type: [String],
      default: []
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    // QnaireResponses holds QRespondent _id's
    QnaireResponses: {
      type: [String],
      default: []
    },
    technicalSkillsData: {
      type: String,
      //default: undefined
      default: ""
    }
  },
  helpers: {
    calculateAge() {
      if (this.birthDate) {
        const diff = Date.now() - this.birthDate.getTime();
        this.age = Math.abs(new Date(diff).getUTCFullYear() - 1970);
      }
    },
    fullName(param) {
      var fullName = this.firstName + ' ' + this.lastName;
      if (param === 'lower') {
        return fullName.toLowerCase();
      } else if (param === 'upper') {
        return fullName.toUpperCase();
      }
      return fullName;
    },
    // function needs qnaire, and qresponce data subscriptions
    // use this code in template: eval(userObj.MyProfile.traitSpectrumQnaire(inputKey)); 
    // inputKey values:
    // categoryLetters returns the personality category letters (0,3,6,9), 
    //   precice values (1, 4, 7, 10) and rounded percent (2, 5, 8, 11) values 
    //   pushed to a json object or false if the 4 categories don't exist yet
    traitSpectrumQnaire(inputKey) {
      let f2 = '42';
      let qrespLength = this.QnaireResponses.length;
      let qrespArray = this.QnaireResponses;
	    if (qrespArray === undefined || qrespArray.constructor !== Array) {
        return false;
      }
      let returnString = 'console.log("inputKey does not match");';
      if (inputKey == 'categoryLetters') {
        returnString = `
          qLength = ` + qrespLength + `;
          qArray = ["` + qrespArray.join('","') + `"];
          let returnValue = 'initial returnValue';
          let tsQresp = 'no qrespondent';
          let tsQnrid = Meteor.call('qnaire.getIdByTitle','Trait Specturm'); // qnaire ID for the qnaire Trait Spectrum '5c9544d9baef97574'
          let randQresp = QRespondent.findOne({});
          if (typeof userObj === undefined || typeof randQresp === undefined) returnValue = false;
          else {
            for (i = 0; i < qLength; i++) {
              // console.log('ihi: ', i);
              let respId = qArray[i];
              console.log('respId', respId);
              tempQresp = QRespondent.findOne({_id: respId});
              console.log('tempQresp: ', tempQresp);
              if (tempQresp != undefined && tempQresp.qnrid == tsQnrid) {
                tsQresp = tempQresp;
              }
            }
            console.log('tsQresp: ', tsQresp);
            let ieCat = tsQresp.responses.find((resp) => {return resp.qqLabel == '_IE'});
            let nsCat = tsQresp.responses.find((resp) => {return resp.qqLabel == '_NS'});
            let tfCat = tsQresp.responses.find((resp) => {return resp.qqLabel == '_TF'});
            let jpCat = tsQresp.responses.find((resp) => {return resp.qqLabel == '_JP'});
            let ieCatCount = tsQresp.responses.find((resp) => {return resp.qqLabel == '_IE_count'});
            let nsCatCount = tsQresp.responses.find((resp) => {return resp.qqLabel == '_NS_count'});
            let tfCatCount = tsQresp.responses.find((resp) => {return resp.qqLabel == '_TF_count'});
            let jpCatCount = tsQresp.responses.find((resp) => {return resp.qqLabel == '_JP_count'});
            console.log('ieCat: ', ieCat);
            console.log('nsCat: ', nsCat);
            console.log('tfCat: ', tfCat);
            console.log('jpCat: ', jpCat);
            console.log('ieCatCount: ', ieCatCount);
            console.log('nsCatCount: ', nsCatCount);
            console.log('tfCatCount: ', tfCatCount);
            console.log('jpCatCount: ', jpCatCount);
            if (
              ieCat == undefined 
              || nsCat == undefined 
              || tfCat == undefined 
              || jpCat == undefined
              || ieCatCount == undefined 
              || nsCatCount == undefined 
              || tfCatCount == undefined 
              || jpCatCount == undefined
            ) {
              returnValue = false;
            } else {
              returnValue = [];
              if (ieCat.qqData >= 0) {
                returnValue.push('I');
              } else {
                returnValue.push('E');
              }
              returnValue.push(ieCat.qqData / ieCatCount.qqData);
              returnValue.push(50 + Math.ceil(Math.abs(ieCat.qqData / ieCatCount.qqData)));
              if (nsCat.qqData >= 0) {
                returnValue.push('S');
              } else {
                returnValue.push('N');
              }
              returnValue.push(nsCat.qqData / nsCatCount.qqData);
              returnValue.push(50 + Math.ceil(Math.abs(nsCat.qqData / nsCatCount.qqData)));
              if (tfCat.qqData >= 0) {
                returnValue.push('F');
              } else {
                returnValue.push('T');
              }
              returnValue.push(tfCat.qqData / tfCatCount.qqData);
              returnValue.push(50 + Math.ceil(Math.abs(tfCat.qqData / tfCatCount.qqData)));
              if (jpCat.qqData >= 0) {
                returnValue.push('P');
              } else {
                returnValue.push('J');
              }
              returnValue.push(jpCat.qqData / jpCatCount.qqData);
              returnValue.push(50 + Math.ceil(Math.abs(jpCat.qqData / jpCatCount.qqData)));
            }
            returnValue = {
              'IE': {
                'letter': returnValue[0],
                'presice': returnValue[1],
                'rounded': returnValue[2]
              },
              'NS': {
                'letter': returnValue[3],
                'presice': returnValue[4],
                'rounded': returnValue[5]
              },
              'TF': {
                'letter': returnValue[6],
                'presice': returnValue[7],
                'rounded': returnValue[8]
              },
              'JP': {
                'letter': returnValue[9],
                'presice': returnValue[10],
                'rounded': returnValue[11]
              }
            }
          }
          // evaluating the return value:
          returnValue;
        `;
      }
      return returnString;
    }
  },
	meteorMethods: {
		addQnaireResponse(newRespId) {
			let respExists = false;
			this.QnaireResponses.forEach(function(element) {
				if (newRespId == element) {
					respExists = true;
				}
			});
			if (!respExists) {
				let userId = Meteor.userId();
				let u = User.findOne({_id: userId});
				Meteor.users.update({_id: userId}, {$push: {"MyProfile.QnaireResponses": newRespId}});
			}
			console.log("newRespId: ", newRespId);
		},
//		removeQnaireResponse(respId) {
//			console.log("1");
//			let respExists = false;
//			this.QnaireResponses.forEach(function(element) {
//				if (newRespId == element) {
//					respExists = true;
//				}
//			});
//			if (respExists) {
//				let userId = Meteor.userId();
//				let u = User.findOne({_id: userId});
//				Meteor.users.update({_id: userId}, {$pull: {"MyProfile.QnaireResponses": respId}});
//			}
//		}
	}
});

const User = Class.create({
    name: 'User',
    collection: Meteor.users,
    fields:{
        createdAt: Date,
        emails: {
            type: [Object],
            default: function() { return []; }
        },
        MyProfile: {
            type: Profile,
            default: function() { return new Profile(); }
        },
        teams: {
        	type: [String],
        	default: function() { return [ Team.Default.Name ]; }
        },
        roles: {
            type: Object
        }
    },
    resolveError({ nestedName, validator }) {
        console.log(nestedName, validator);
    },
    events: {
        afterInit(e) {
            if(e.target.MyProfile){
                e.target.MyProfile.calculateAge();
            }
        },
        beforeSave(e) {
            if (e.currentTarget.MyProfile.Categories.length() === 0) {
                e.currentTarget.MyProfile.Categories.addCategory(Category.Default);
            }
            if (e.currentTarget.teams.length === 0) {
            	e.currentTarget.addTeam( Team.Default.Name );
            }
        }
    },
    meteorMethods: {
        create() {
            return this.save();
        },
        changeName(firstName, lastName) {
            check(firstName, String);
            check(lastName, String);
            this.MyProfile.firstName = firstName;
            this.MyProfile.lastName = lastName;
            return this.save();
        },
        fullName(param) {
            return this.MyProfile.fullName(param);
        },
        addTeam(teamName) {
        	let teamDoc = Team.findOne({ "Name" : teamName});
        	if (typeof teamDoc !== "undefined") {
                teamDoc.addUsers(this._id);
        	} else {
                return false;
            }
        },
        profileUpdate(uprofile) {
            if (Meteor.isClient) return;
            if ("undefined" === typeof this.createdAt) {
                this.createdAt = new Date();
            }
            if ("undefined" === typeof this.MyProfile.segments) {
                this.MyProfile.segments = [];
            }
            if ("undefined" === typeof uprofile.segments) {
                uprofile.segments = [];
            }
            if ("undefined" === typeof uprofile.emailNotifications) {
                uprofile.emailNotifications = false;
            }
            check(uprofile.firstName, String);
            check(uprofile.lastName, String);

            this.MyProfile.firstName = uprofile.firstName;
            this.MyProfile.lastName = uprofile.lastName;
            this.MyProfile.segments = uprofile.segments;
            this.MyProfile.emailNotifications = uprofile.emailNotifications;
            if ("" !== uprofile.birthDate) {
                this.MyProfile.birthDate = new Date(uprofile.birthDate);
            }
            return this.save();
        },
        addRole(role) {
            console.log(this.MyProfile.firstName, role);
            if (Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
                Roles.addUsersToRoles(this._id, role, Roles.GLOBAL_GROUP);
            }
        },
        removeRole(role) {
            console.log(this.MyProfile.firstName, role);
            if (Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
                Roles.removeUsersFromRoles(this._id, role, Roles.GLOBAL_GROUP);
            }
        },
		removeQnaireResponse(respId) {
			console.log("1111111111111111");
			let respExists = false;
			this.MyProfile.QnaireResponses.forEach(function(element) {
				if (newRespId == element) {
					respExists = true;
				}
			});
			if (respExists) {
				let userId = Meteor.userId();
				let u = User.findOne({_id: userId});
				Meteor.users.MyProfile.update({_id: userId}, {$pull: {"MyProfile.QnaireResponses": respId}});
			}
		},
    registerTechnicalSkillsDataKey(TSQKey) {
      console.log('test before: ', this.MyProfile.technicalSkillsData);
      this.MyProfile.technicalSkillsData = TSQKey;
      console.log('test after: ', this.MyProfile.technicalSkillsData, TSQKey);
      return this.save();
    }
		
    },
    indexes: {
    },
    behaviors: {
        slug: {
            fieldName: 'email'
        },
        timestamp: {}
    }
});

if (Meteor.isServer) {
  User.extend({
    fields: {
      services: Object
    }
  });
}

export { User, Profile, UserType, MyersBriggs, Answer, QnaireAnswer };
