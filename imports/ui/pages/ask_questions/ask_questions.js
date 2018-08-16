import { Question } from '/imports/api/questions/questions.js';
import { User, Profile, UserType, MyersBriggs, Answer } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import './ask_questions.html';
import '../../components/questions/questions.js';
import '../../components/personality/personality.js';




Template.ask_questions.helpers({
    answeredQuestionsLength() {
        let u = User.findOne({_id:Template.instance().userId});
        return u.MyProfile.UserType.AnsweredQuestions.length;
    }
});
