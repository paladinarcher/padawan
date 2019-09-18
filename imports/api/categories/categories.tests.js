import { Category } from './categories.js';

if (Meteor.isServer) {
    let aId = '98496748566'

    FactoryBoy.define("categoryA", Category, {
        _id: aId,
        name: "categoryA",
        description: "description for categoryA"
    });

    describe('Categories', function () {
        it('Can create a category', function () {
            let catA = FactoryBoy.create('categoryA');
            // console.log('catA', catA);
            // console.log('todo');
            let startCatA = Category.find({ _id: aId }).fetch();
            // console.log('startCatA', startCatA);
            chai.assert.strictEqual(startCatA[0].name, 'categoryA', 'The category was not created correctly');
        });
        //      Category
        // addByType
        // removeByType
        // getStatsByType
        // update
        //      CategoryManager
        // length
        // areIntersected
        // addCategory
        // hasCategory
        // removeCategory

    });
}