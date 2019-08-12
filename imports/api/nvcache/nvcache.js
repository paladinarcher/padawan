import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class, Enum } from 'meteor/jagi:astronomy';

const NVCache = Class.create({
  name: 'NVCache',
  collection: new Mongo.Collection('nvcache'),
  fields:{
    createdAt: Date,
    name: {
      type: String
    },
    value: {
      type: Object
    },
    updatedAt: Date
  },
  resolveError({ nestedName, validator }) {
    console.log(nestedName, validator);
  },
  events: {
    afterInit(e) {
    },
    beforeSave(e) {
    }
  },
  meteorMethods: {
    isExpired(ttl) {
      var date = new Date();
      //date.setDate(date.getDate() - 15);
      date.setMinutes(date.getMinutes() - ttl);
      return typeof this.updatedAt == "undefined" || date >= this.updatedAt;
    }
  },
  indexes: {
    name: {
      fields: {
        name: 1
      },
      options: {
        unique: true
      }
    }
  },
  behaviors: {
    timestamp: {}
  }
});

export { NVCache };