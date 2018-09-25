import { Class } from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';
import { MyersBriggsCategory, Question } from '../questions/questions.js';
import { Category, CategoryManager } from '../categories/categories.js';
import { Defaults } from '../../startup/both/defaults.js';
import { Team } from '../teams/teams.js';
import { UserSegment } from '../user_segments/user_segments.js';

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
    fields: {
        firstName: {
            type: String,
            validators: [{
              type: 'minLength',
              param: 2
            }]
        },
        lastName: {
            type: String,
            validators: [{
              type: 'minLength',
              param: 2
            }]
        },
        /*
        email: {
          type: String,
          validators: [{
            type: 'minLength',
            param: 5
          }]
        },
        */
        UserType: {
            type: UserType,
            default: function () { return new UserType(); }
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
                return CategoryManager.OfType("User");
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
          default: false
        }
    },
    helpers: {
        calculateAge() {
            if (this.birthDate) {
                const diff = Date.now() - this.birthDate.getTime();
                this.age = Math.abs((new Date(diff)).getUTCFullYear() - 1970);
            }
        },
        fullName(param) {
            var fullName = this.firstName + ' ' + this.lastName;
            if (param === 'lower') { return fullName.toLowerCase(); }
            else if (param === 'upper') { return fullName.toUpperCase(); }
            return fullName;
        }
    },
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
            e.target.MyProfile.calculateAge();
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
            check(uprofile.firstName, String);
            check(uprofile.lastName, String);
            //check(uprofile.email, String);
            check(uprofile.gender, Boolean);

            this.MyProfile.firstName = uprofile.firstName;
            this.MyProfile.lastName = uprofile.lastName;
            //this.MyProfile.email = uprofile.email;
            this.MyProfile.gender = uprofile.gender;
            console.log("888888",uprofile.segments);
            this.MyProfile.segments = uprofile.segments;
            if ("" !== uprofile.birthDate) {
                this.MyProfile.birthDate = new Date(uprofile.birthDate);
            }
            console.log(this);
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
        }
        /*,
        setEmail(newEmail) {
            console.log("entered setEmail. newEmail: ", newEmail);
            this.emails[0].address = newEmail;
            console.log("this.emails[0].address: ", this.emails[0].address, this);
        }*/
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

export { User, Profile, UserType, MyersBriggs, Answer };
