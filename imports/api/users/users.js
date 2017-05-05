import { Class } from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';
import { MyersBriggsCategory} from '../questions/questions.js';

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
            this.Value = this.Totals / this.QuestionCount;
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
        getIdentifierById(categoryId) {
            if(categoryId === 0) { return 'IE'; }
            if(categoryId === 1) { return 'NS'; }
            if(categoryId === 2) { return 'TF'; }
            return 'JP';
        },
        getFourLetter() {
            let IEL = (this.IE.Value === 0 ? '_' : (this.IE.Value > 0 ? 'I' : 'E'));
            let NSL = (this.NS.Value === 0 ? '_' : (this.NS.Value > 0 ? 'N' : 'S'));
            let TFL = (this.TF.Value === 0 ? '_' : (this.TF.Value > 0 ? 'T' : 'F'));
            let JPL = (this.JP.Value === 0 ? '_' : (this.JP.Value > 0 ? 'J' : 'P'));
            return `${IEL}${NSL}${TFL}${JPL}`;
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
        }
    },
    resolveError({ nestedName, validator }) {
        console.log(nestedName, validator);
    },
    events: {
        afterInit(e) {
            e.target.MyProfile.calculateAge();
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