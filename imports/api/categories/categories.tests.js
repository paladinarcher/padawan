import { Category, CategoryManager } from './categories.js';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { User } from '/imports/api/users/users.js';


if (Meteor.isServer) {
    let aId = '98496748566';
    let bId = '85034958349';
    let cId = '75359745830';
    let dId = '57983531579';
    let eId = '34957284394';
    let fId = '29238475233';
    
    FactoryBoy.define("defaultUserCategory", User, {
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

    FactoryBoy.define("emptyCategoryArray", User, {
        _id: dId,
        services: {
            password: {}
        },
        username: "bestTestUser",
        emails: [],
        slug: "testUser@domain.com",
        MyProfile: {
            Categories: {
                Categories: []
            },
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

    FactoryBoy.define("categoryE", Category, {
        _id: eId,
        name: "categoryE",
        description: "description for categoryE",
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

    FactoryBoy.define("categoryF", Category, {
        _id: fId,
        name: "categoryF",
        description: "description for categoryF",
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
            let startCatA = Category.find({ _id: aId }).fetch();
            chai.assert.strictEqual(startCatA[0].name, 'categoryA', 'The category was not created correctly');
        });
        //      Category helpers and methods
        // addByType
        it('addByType adds a correct amount to cow and User', function () {
            FactoryBoy.create('categoryA');
            catA = Category.find({ _id: aId }).fetch()[0];
            chai.assert.strictEqual(catA.stats.User.num, 76, 'User num is not 76');
            chai.assert.strictEqual(catA.stats.cow, undefined, 'cow should be undefined');
            catA.addByType("cow"); // cow is 1
            catA.addByType("cow"); // cow is 2
            catA.addByType("User"); // User is 77
            catA.addByType("User"); // User is 78
            catA.addByType("User"); // User is 79
            chai.assert.strictEqual(catA.stats.User.num, 79, 'User num is not 79');
            chai.assert.strictEqual(catA.stats.cow.num, 2, 'cow num is not 2');

        });
        // removeByType
        it('removeByType removes category numbers correctly', function () {
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
            chai.assert.strictEqual(catA.stats.sink.num, 0, 'sink should be undefined');
            chai.assert.strictEqual(catA.stats.cow.num, 1, 'cow should be 1');
            chai.assert.strictEqual(catA.stats.User.num, 75, 'User should be 75');
        });
        // getStatsByType
        it('getStatsByType returns correct num number', function () {
            let catA = FactoryBoy.create('categoryA');
            let startCatA = Category.find({ _id: aId }).fetch();
            let gsbt = catA.getStatsByType("User");
            chai.assert.strictEqual(gsbt.num, 76, 'getStatsByType did not return Class num 76');
        });
        // update
        it('update function can change name and description', function () {
            FactoryBoy.create('categoryA');
            let catA = Category.find({ _id: aId }).fetch()[0];
            let myFalseStub = sinon.stub(Roles, 'userIsInRole').returns(false);
            catA.update('changeName', 'changeDescription');
            myFalseStub.restore();
            catA = Category.find({ _id: aId }).fetch()[0];
            chai.assert.strictEqual(catA.name, 'categoryA', 'catA name changed');
            chai.assert.strictEqual(catA.description, 'description for categoryA', 'catA description changed');

            let myTrueStub = sinon.stub(Roles, 'userIsInRole').returns(true);
            catA.update('changeName', 'changeDescription');
            myTrueStub.restore();
            catA = Category.find({ _id: aId }).fetch()[0];
            chai.assert.strictEqual(catA.name, 'changeName', 'catA name did not change');
            chai.assert.strictEqual(catA.description, 'changeDescription', 'catA description did not change');
        });
        //      CategoryManager
        it('Can access a CategoryManager', function () {
            let ducU = FactoryBoy.create('defaultUserCategory');
            let ecaU = FactoryBoy.create('emptyCategoryArray');
            ducU = User.find({ _id: cId }).fetch();
            ecaU = User.find({ _id: dId }).fetch();
            chai.assert.strictEqual(ducU[0]._id, cId, 'Creating the default category user failed');
            chai.assert.strictEqual(ducU[0].MyProfile.Categories.Type, 'User', 'User not showing CategoryManager');
            chai.assert.strictEqual(ecaU[0]._id, dId, 'Creating the empty array category user failed');
            chai.assert.strictEqual(ecaU[0].MyProfile.Categories.Type, 'um... what!?', 'User not showing CategoryManager');
        });
        //      CategoryManager helpers and methods
        // length
        it('CategoryManager length returns Category array length', function () {
            let ducU = FactoryBoy.create('defaultUserCategory');
            let ecaU = FactoryBoy.create('emptyCategoryArray');
            ducU = User.find({ _id: cId }).fetch();
            ecaU = User.find({ _id: dId }).fetch();
            chai.assert.strictEqual(ducU[0].MyProfile.Categories.length(), 1, 'default user should have had categorie length of 1');
            chai.assert.strictEqual(ecaU[0].MyProfile.Categories.length(), 1, 'empty array user should have had categorie length of 1');

            ducU[0].MyProfile.Categories.Categories = [];
            ecaU[0].MyProfile.Categories.Categories = ['qwer', 'asdf'];
            chai.assert.strictEqual(ducU[0].MyProfile.Categories.length(), 0, 'default user should have had categorie length of 1');
            chai.assert.strictEqual(ecaU[0].MyProfile.Categories.length(), 2, 'empty array user should have had categorie length of 1');
        });
        // areIntersected
        it('areIntersected returns true and false appropriately', function () { 
            let ducU = FactoryBoy.create('defaultUserCategory'); 
            let ecaU = FactoryBoy.create('emptyCategoryArray'); 
            let ducUC = User.find({ _id: cId }).fetch()[0].MyProfile.Categories; 
            let ecaUC = User.find({ _id: dId }).fetch()[0].MyProfile.Categories; 
            let catManIntersects = ecaUC.areIntersected(ducUC);
            chai.assert.strictEqual(catManIntersects, true, 'Initial category managers should intersect');

            ducUC.Categories = [];
            ecaUC.Categories = ['jkl', 'def'];
            catManIntersects = ecaUC.areIntersected(ducUC);
            chai.assert.strictEqual(catManIntersects, false, 'Category managers should not intersect');

            ducUC.Categories = ['abc', 'def', 'ghi'];
            ecaUC.Categories = ['jkl', 'def'];
            catManIntersects = ecaUC.areIntersected(ducUC);
            chai.assert.strictEqual(catManIntersects, true, 'Category managers should intersect');

            ducUC.Categories = ['abc', 'ghi'];
            ecaUC.Categories = ['jkl', 'def'];
            catManIntersects = ecaUC.areIntersected(ducUC);
            chai.assert.strictEqual(catManIntersects, false, 'Category managers should not intersect');

            ducUC.Categories = ['abc', 'ghi'];
            ecaUC.Categories = [];
            catManIntersects = ecaUC.areIntersected(ducUC);
            chai.assert.strictEqual(catManIntersects, false, 'Category managers should not intersect');
        });
        // addCategory 
        it('addCategory adds appropriate category ids and type keys', function () {
            FactoryBoy.create('defaultUserCategory'); 
            FactoryBoy.create('emptyCategoryArray'); 
            let ducUC = User.find({ _id: cId }).fetch()[0].MyProfile.Categories; 
            let ecaUC = User.find({ _id: dId }).fetch()[0].MyProfile.Categories; 
            FactoryBoy.create('categoryA');
            catA = Category.find({ _id: aId }).fetch()[0];

            ducUC.addCategory(catA);
            chai.assert.strictEqual(ducUC.Categories[1], catA._id, 'Category not added');
            chai.assert.isTrue(Object.keys(catA.stats).includes('User'), 'Category type should include User');

            ecaUC.Categories = [];
            ecaUC.addCategory(catA, 'cowType');
            chai.assert.strictEqual(ecaUC.Categories[0], catA._id, 'Category not added');
            chai.assert.isTrue(Object.keys(catA.stats).includes('cowType'), 'Category type should include cowType');

            catA._id = bId;
            ecaUC.addCategory(catA, 'snakeType');
            chai.assert.isTrue(ecaUC.Categories.includes(bId), 'Category should include bId number');
            chai.assert.isTrue(Object.keys(catA.stats).includes('snakeType'), 'Category type should include snakeType');

        })
        // hasCategory
        it('hasCategory returns undefined or the _id correctly', function () {
            FactoryBoy.create('defaultUserCategory'); 
            FactoryBoy.create('emptyCategoryArray'); 
            let ducUC = User.find({ _id: cId }).fetch()[0].MyProfile.Categories; 
            let ecaUC = User.find({ _id: dId }).fetch()[0].MyProfile.Categories; 
            FactoryBoy.create('categoryA');
            catA = Category.find({ _id: aId }).fetch()[0];

            let hasReturn = ducUC.hasCategory(catA);
            chai.assert.strictEqual(hasReturn, false, 'hasCategory should return false');

            ecaUC.Categories = ['asdf', catA._id];
            hasReturn = ecaUC.hasCategory(catA);
            chai.assert.strictEqual(hasReturn, catA._id, 'hasCategory should return the category id');
        });
        // removeCategory
        it('removeCategory', function () {
            FactoryBoy.create('defaultUserCategory'); 
            FactoryBoy.create('emptyCategoryArray'); 
            let ducUC = User.find({ _id: cId }).fetch()[0].MyProfile.Categories; 
            let ecaUC = User.find({ _id: dId }).fetch()[0].MyProfile.Categories; 
            FactoryBoy.create('categoryA');
            let catA = Category.find({ _id: aId }).fetch()[0];
            FactoryBoy.create('categoryE');
            let catE = Category.find({ _id: eId }).fetch()[0];
            FactoryBoy.create('categoryF');
            let catF = Category.find({ _id: fId }).fetch()[0];

            ducUC.Categories = [];
            ducUC.addCategory(catF, 'waterType')
            ducUC.addCategory(catA, 'ghostType');
            ducUC.addCategory(catE, 'fireType');

            chai.assert.strictEqual(catA.stats.User.num, 76, 'catA User num should be 76');
            chai.assert.isTrue(ducUC.Categories.includes(catA._id), 'ducUC is missing a category catA id');
            let removeRet = ducUC.removeCategory(catA, 'User');
            chai.assert.strictEqual(catA.stats.User.num, 75, 'catA User num should be 75');
            chai.assert.isFalse(ducUC.Categories.includes(catA._id), 'ducUC shouldnt have a category catA id');
            catA = Category.find({ _id: aId }).fetch()[0];

            chai.assert.strictEqual(catE.stats.fireType.num, 1, 'catE fireType num should be 1');
            chai.assert.isTrue(ducUC.Categories.includes(catE._id), 'ducUC is missing a category catE id');
            removeRet = ducUC.removeCategory(catE, 'fireType', false);
            chai.assert.strictEqual(catE.stats.fireType.num, 0, 'catE User num should be 0');
            chai.assert.isFalse(ducUC.Categories.includes(catE._id), 'ducUC shouldnt have a category catE id');
            catE = Category.find({ _id: eId }).fetch()[0];

            chai.assert.isTrue(ducUC.Categories.includes(catF._id), 'ducUC is missing a category catF id');
            removeRet = ducUC.removeCategory(catF);
            chai.assert.isFalse(ducUC.Categories.includes(catF._id), 'ducUC shouldnt have a category catF catF id');

            ecaUC.Categories = [];
            ecaUC.addCategory(catA, 'grassType');
            ecaUC.addCategory(catF, 'psychicType');

            chai.assert.strictEqual(catA.stats.grassType.num, 1, 'catA grassType num should be 1');
            chai.assert.isTrue(ecaUC.Categories.includes(catA._id), 'ecaUC is missing a category id');
            removeRet = ecaUC.removeCategory(catA);
            chai.assert.strictEqual(catA.stats.grassType.num, 1, 'catA grassType num should still be 1');
            chai.assert.isFalse(ecaUC.Categories.includes(catA._id), 'ecaUC shouldnt have a category catA id');

            chai.assert.isFalse(Object.keys(catF.stats).includes('thisTypeDoesntExist'), 'catF should not have the key thisTypeDoesntExist');
            chai.assert.isTrue(ecaUC.Categories.includes(catF._id), 'ecaUC is missing a category catF id');
            removeRet = ecaUC.removeCategory(catF, 'thisTypeDoesntExist');
            chai.assert.isFalse(Object.keys(catF.stats).includes('thisTypeDoesntExist'), 'catF should not have the key thisTypeDoesntExist');
            chai.assert.isFalse(ecaUC.Categories.includes(catF._id), 'ecaUC should be missing a category catF id');
        });

    });
}