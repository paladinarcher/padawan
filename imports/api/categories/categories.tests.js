import { Category, CategoryManager, cmWrapper } from './categories.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { TypeReading } from '/imports/api/type_readings/type_readings.js';
import { User } from '/imports/api/users/users.js';


if (Meteor.isServer) {
    let aId = '98496748566'
    let bId = '85034958349'
    let cId = '75359745830'

    // const cmWrappers = ; // CategoryManager dependency
    // const cmWrapper = Class.create({
    //     name: 'cmWrappers',
    //     collection: new Mongo.Collection('cmWrappers'),
    //     fields: {
    //         catMan: {
    //             type: CategoryManager
    //         }
    //     }
    // });
    // export { cmWrapper };

    FactoryBoy.define("nonAdminUser1", User, {
        _id: cId,
        services: {
            password: {}
        },
        username: "bestTestUser",
        emails: [],
        slug: "testUser@domain.com",
        MyProfile: {
            firstName: "testUser",
            lastName: "test",
            gender: true,
            UserType: {
                Personality: {},
                AnsweredQuestions: []
            },
            birthDate: new Date("December 17, 1995 03:24:00")
        },
        teams: [],
        roles: {},
        profile: {
            first_name: "testUser",
            last_name: "test",
            gender: "male"
        }
    });

    FactoryBoy.define("cmWrapA", cmWrapper, {
        _id: cId,
        Categories: []
    });

    // FactoryBoy.define("cmWrapReading", TypeReading, {
    //     // _id: cId,
    //     // Categories: []
    // });

    FactoryBoy.define("categoryA", Category, {
        _id: aId,
        name: "categoryA",
        description: "description for categoryA",
        "stats": {
            "User": {
                "EJSON$type": "Astronomy",
                "EJSON$value": {
                    "EJSONclass": "TypeStats",
                    "EJSONvalues": "{ \"num\": 76}"
                }
            }
        }
    });

    FactoryBoy.define("managerB", CategoryManager, {
        _id: bId
    });

    describe('Category', function () {
        beforeEach(function () {
            resetDatabase();
        });

        afterEach(function () {
            resetDatabase();
        });
        //      Category class
        it('Can create a category', function () {
            let catA = FactoryBoy.create('categoryA');
            // console.log('catA', catA);
            // console.log('todo');
            let startCatA = Category.find({ _id: aId }).fetch();
            // console.log('startCatA', startCatA);
            chai.assert.strictEqual(startCatA[0].name, 'categoryA', 'The category was not created correctly');
        });
        //      Category helpers and methods
        // addByType
        it('addByType adds a correct amount to cow and User', function () {
            FactoryBoy.create('categoryA');
            catA = Category.find({ _id: aId }).fetch()[0];
            // console.log('start catA: ', catA);
            chai.assert.strictEqual(catA.stats.User.num, 76, 'User num is not 76');
            chai.assert.strictEqual(catA.stats.cow, undefined, 'cow should be undefined');
            catA.addByType("cow"); // cow is 1
            catA.addByType("cow"); // cow is 2
            catA.addByType("User"); // User is 77
            catA.addByType("User"); // User is 78
            catA.addByType("User"); // User is 79
            // console.log('catA after add: ', catA);
            // console.log('User stats', catA.stats.User.num);
            chai.assert.strictEqual(catA.stats.User.num, 79, 'User num is not 79');
            chai.assert.strictEqual(catA.stats.cow.num, 2, 'cow num is not 2');

        });
        // removeByType
        it('removeByType', function () {
            FactoryBoy.create('categoryA');
            let catA = Category.find({ _id: aId }).fetch()[0];
            // console.log('catA: ', catA);
            chai.assert.strictEqual(catA.stats.User.num, 76, 'User num is not 76');
            chai.assert.strictEqual(catA.stats.cow, undefined, 'cow should be undefined');
            chai.assert.strictEqual(catA.stats.sink, undefined, 'cow should be undefined');
            catA.addByType("cow"); // cow is 1
            catA.addByType("cow"); // cow is 2
            catA.removeByType("cow"); // cow is 1
            catA.removeByType("sink");
            chai.assert.strictEqual(catA.stats.sink, undefined, 'sink should be undefined');
            catA.addByType("sink"); // sink is 1
            catA.removeByType("sink"); // sink is 0
            catA.removeByType("sink"); // -1 should go to 0
            catA.removeByType("User"); // User is 75
            // console.log('catA after remove', catA);
            chai.assert.strictEqual(catA.stats.sink.num, 0, 'sink should be undefined');
            chai.assert.strictEqual(catA.stats.cow.num, 1, 'sink should be undefined');
            chai.assert.strictEqual(catA.stats.User.num, 75, 'sink should be undefined');
        });
        // getStatsByType
        it('getStatsByType returns correct num number', function () {
            let catA = FactoryBoy.create('categoryA');
            let startCatA = Category.find({ _id: aId }).fetch();
            // console.log('catA: ', catA);
            // console.log('startCatA', startCatA);
            let gsbt = catA.getStatsByType("User");
            // console.log('gsbt: ', gsbt);
            chai.assert.strictEqual(gsbt.num, 76, 'getStatsByType did not return Class num 76');
        });
        // update
        it('update', function () {
            FactoryBoy.create('categoryA');
            let catA = Category.find({ _id: aId }).fetch()[0];
            // Roles.userIsInRole is false for non admin test
            let myFalseStub = sinon.stub(Roles, 'userIsInRole').returns(false);
            catA.update('changeName', 'changeDescription');
            myFalseStub.restore();
            catA = Category.find({ _id: aId }).fetch()[0];
            // console.log('catA: ', catA);
            chai.assert.strictEqual(catA.name, 'categoryA', 'catA name changed');
            chai.assert.strictEqual(catA.description, 'description for categoryA', 'catA description changed');

            // Roles.userIsInRole is true for admin test
            let myTrueStub = sinon.stub(Roles, 'userIsInRole').returns(true);
            catA.update('changeName', 'changeDescription');
            myTrueStub.restore();
            catA = Category.find({ _id: aId }).fetch()[0];
            // console.log('catA: ', catA);
            chai.assert.strictEqual(catA.name, 'changeName', 'catA name did not change');
            chai.assert.strictEqual(catA.description, 'changeDescription', 'catA description did not change');
        });
        //      CategoryManager
        it('Can create a CategoryManager', function () {
            // const CategoryManager = new Mongo.Collection('categoryManager');
            // let u = FactoryBoy.create('nonAdminUser1');
            // console.log('u: ', u);
            // u = User.find({ _id: cId }).fetch();
            // console.log('u2: ', u);

            // let wrapRead = FactoryBoy.create('cmWrapReading')
            // console.log('wrapR1: ', wrapRead);
            // wrapRead = TypeReading.find({ _id: cId }).fetch();
            // console.log('wrapR2: ', wrapRead);


            // let wrapA = FactoryBoy.create('cmWrapA');
            // console.log('wrapA1: ', wrapA);
            // wrapA = cmWrapper.find({ _id: cId }).fetch();
            // console.log('wrapA2: ', wrapA);

            // CategoryManager.insert({ title: 'Hello world', body: 'First post' });
            // console.log('count: ', CategoryManager.find().fetch());
            // console.log('catMan: ', CategoryManager);
            // console.log('deleteThis');
            // let manB = FactoryBoy.create('managerB');
            // let manB = Category.find({ _id: bId }).fetch();
            // console.log('manB: ', manB);
            // console.log('manB: ', manB.length());
            // chai.assert.strictEqual(startCatA[0].name, 'categoryA', 'The category was not created correctly');
        });
        //      CategoryManager helpers and methods
        // length
        // todo
        // areIntersected
        // todo
        // addCategory
        // todo
        // hasCategory
        // todo
        // removeCategory
        // todo

    });
}