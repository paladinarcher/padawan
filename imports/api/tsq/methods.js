import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

Meteor.methods({
  'tsq.registerKeyToUser' () {
    let modifiedResult;
    try {
      let result = HTTP.post('http://localhost:4000/tsq/skills/users/register');
      modifiedResult = result;
    } catch (e) {
      throw new Meteor.Error('some-error-code', 'Something bad went down');
    }
    return modifiedResult;
  },  
  'tsq.getKeyData' (key) {
      let modifiedResult;
      try {
        let result = HTTP.get('http://localhost:4000/tsq/skills/users/findOne/key/' + key);
        modifiedResult = result;
      } catch (e) {
        throw new Meteor.Error('some-error-code', 'Something bad went down');
      }
      return modifiedResult;
  },
  'tsq.skillLookup' (skill) {
    let modifiedResult;
    try {
      let result = HTTP.get('http://localhost:4000/tsq/skills/?name=' + skill);
      modifiedResult = result;
    } catch (e) {
      throw new Meteor.Error('SkillLookup Error', e);
    }
    return modifiedResult;
  }
})
