import { Category, CategoryManager } from './categories.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';


if (Meteor.isServer) {
    let aId = '98496748566'
    let bId = '85034958349'

    const CategoryManager = new Mongo.Collection('categoryManager'); // CategoryManager dependency

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
            CategoryManager.insert({ title: 'Hello world', body: 'First post' });
            console.log('count: ', CategoryManager.find().fetch());
            console.log('deleteThis');
            let manB = FactoryBoy.create('managerB');
            // let manB = Category.find({ _id: bId }).fetch();
            console.log('manB: ', manB);
            console.log('manB: ', manB.length());
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