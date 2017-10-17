import { Class } from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';
import { MyersBriggsCategory, Question } from '../questions/questions.js';
import { Category, CategoryManager } from '../categories/categories.js';
import { Defaults } from '../../startup/both/defaults.js';
import { Team } from '../teams/teams.js';

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
        answerQuestion(answer) {
            this.AnsweredQuestions.push(answer);
            this.Personality.addByCategory(answer.Category, answer.Value);
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
            this.Personality.removeByCategory(answer.Category, answer.Value);
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
        UserType: {
            type: UserType,
            default: function () { return new UserType(); }
        },
        gender: {
            type: Boolean,
            default: false
        },
        Categories: {
            type: CategoryManager,
            default: function() {
                return CategoryManager.OfType("User");
            }
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
        	let teamDoc = Team.getCollection().findOne({ "Name" : teamName});
        	if (typeof teamDoc !== "undefined") {
        		this.teams.push(teamName);
        		return this.save();
        	}
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

export { User, Profile, UserType, MyersBriggs, Answer };
