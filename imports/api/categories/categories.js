import { Class } from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';
const DefaultCategoryID = "xhKdwhacaWTcBTGPn";
const TypeStats = Class.create({
    name: 'TypeStats',
    fields: {
        num: {
            type: Number,
            default: 0
        }
    }
});
const Category = Class.create({
    name: 'Category',
    collection: new Mongo.Collection('categories'),
    fields: {
        name: {
            type: String,
            default: "the Unnamed Category"
        },
        description: {
            type: String,
            default: "this is the default stuff for a Category"
        },
        stats: {
            type: Object,
            default: function () { return {}; }
        }
    },
    helpers: {
        addByType(type) {
            if(!this.getStatsByType(type)) { this.stats[type] = new TypeStats(); }
            this.getStatsByType(type).num++;
            this.save();
        },
        removeByType(type) {
            if(!this.getStatsByType(type)) { return false; }
            this.getStatsByType(type).num--;
            // num should never be negative
            if (this.getStatsByType(type).num < 0) {
                this.getStatsByType(type).num = 0;
            }
            this.save();
        },
        getStatsByType(type) {
            return this.stats[type];
        }
    },
    meteorMethods: {
        update(name, dscr) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP)) {
                this.name = name;
                this.description = dscr;
                return this.save();
            }
        }
    }
});
Category.Default = Category.findOne({_id:DefaultCategoryID});
if (typeof Category.Default === "undefined") {
    Category.Default = new Category({_id:DefaultCategoryID});
    if (Meteor.isServer) {
        Category.Default.save();
    }
}

const CategoryManager = Class.create({
    name: 'CategoryManager',
    fields: {
        Categories: {
            type: [String],
            default: function () {
                return [];
            }
        },
        Type: {
            type: String,
            default: "um... what!?"
        }
    },
    helpers: {
        length() {
            return this.Categories.length;
        },
        areIntersected(categoryManager) {
            for(let i = 0; i < this.Categories.length; i++) {
                for(let j = 0; j < categoryManager.Categories.length; i++) {
                    if(this.Categories[i] == categoryManager.Categories[j]) { return true; }
                }
            }
            return false;
        },
        addCategory(category, type) {
            if(!type) { type = this.Type; }
            this.Categories.push(category._id);
            category.addByType(type);
        },
        hasCategory(category) {
            if(this.Categories.length == 0) {
                this.addCategory(Category.Default, this.Type);
            }
            return _.find(this.Categories, function (catId) {
                return category._id == catId;
            });
        },
        removeCategory(category, type, skipSlice) {
            let index = -1;
            _.each(this.Categories, function (catId, i) {
                if(catId == category._id) {
                    index = i;
                }
            });
            if(index < 0) { return false; }
            if(!skipSlice) {
                if(index == 0) {
                    this.Categories.shift();
                } else if(index == this.Categories.length - 1) {
                    this.Categories.pop();
                } else {
                    this.Categories = this.Categories.slice(0,index).concat(this.Categories.slice(index+1));
                }
            }
            category.removeByType(type);
        }
    }
});
CategoryManager.OfType = function (type) {
    let c = new CategoryManager();
    c.Type = type;
    return c;
}

export { Category, CategoryManager };
