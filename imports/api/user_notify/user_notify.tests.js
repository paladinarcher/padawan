import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Question } from '../questions/questions.js';
import { User } from '../users/users.js';
import { UserNotify } from './user_notify.js';

FactoryBoy.define("user77", User, {
    _id: "96258405728",
    services: {
        password: {}
    },
    username: "TestUser1",
    emails: [],
    slug: "testUser1@domain.com",
    MyProfile: {
        firstName: "testUser1",
        lastName: "test1",
        gender: true,
        UserType: {
            Personality: {},
            AnsweredQuestions: []
        },
        emailNotifications: true,
        birthDate: new Date("December 22, 1995 03:24:00")
    },
    teams: [],
    roles: {},
    profile: {
        first_name: "testUser1",
        last_name: "test1",
        gender: "male"
    }
});

if (Meteor.isServer) {
    describe('User_Notify Tests', function () {
        it('', function () {
            resetDatabase();
            let user1 = FactoryBoy.create("user77", {
                _id: "4",
                emails: [
                    {
                        address: "myTest@domain.com",
                        verified: false
                    }
                ]
            });
            let findUser = User.findOne({ _id: user1._id });
            let q = FactoryBoy.create('question1');
            let findQuestion = Question.findOne({ _id: "98765432142" });
            let qTest = Question.find({ _id: q._id });
            UserNotify.add({
                userId: user1._id,
                title: 'Questions',
                body: 'New question added',
                action: 'questions:'+q._id
            });
            let un = UserNotify.findOne( {userId:user1._id});
            un.markRead();
            un = UserNotify.findOne( {userId:user1._id});
            chai.assert(un.isRead === true, "user_notify.isRead is NOT true");
            un.markNotified();
            un = UserNotify.findOne( {userId:user1._id});
            chai.assert(un.isPushed === true, "user_notify.isPushed (markNotified) is NOT true");
            un = UserNotify.findOne( {userId:user1._id});
//un.pushNotify();

            /*
                                    note.pushNotify({onclick: function(event) {
                                        let nid = event.target.data;
                                        let un = UserNotify.findOne( {_id:nid} );
                                        un.markRead();
                                        event.target.close();
                                        notificationClickAct(un.action.split(":"));
                                    }});
                                    note.markNotified();

             */
        });
    });
}