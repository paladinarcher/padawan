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
  },
  'tsq.addSkillToUser' (skillInformationArray, key) {
    let modifiedResult;
    console.log(skillInformationArray)
    try {
      let options = {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          skills: skillInformationArray 
        }
      }
      let result = HTTP.put('http://localhost:4000/tsq/skills/users/addSkills/key/' + key, options);
      modifiedResult = result;
    } catch (e) {
      throw new Meteor.Error(e);
    }
    return modifiedResult;
  },
  'tsq.addSkill' (skill) {
    let modifiedResult;
    console.log("The skill passed into meteor method: ", skill)
    try {
      let options = {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          name: skill 
        }
      }
      let result = HTTP.post('http://localhost:4000/tsq/skills/', options);
      modifiedResult = result;
    } catch (e) {
      throw new Meteor.Error(e);
    }
    return modifiedResult;
  },
  'tsq.getRandomSkills' (number) {
    let modifiedResult;
      try {
        let result = HTTP.get('http://localhost:4000/tsq/skills/randomSkills/' + number);
        modifiedResult = result;
      } catch (e) {
        throw new Meteor.Error('some-error-code', 'Something bad went down');
      }
      return modifiedResult;
  },
  'tsq.updateFamiliarInformation' (key, skillName, familarValue) {
    let modifiedResult;
    console.log(familarValue, typeof(familarValue))
    try {
      let options = {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          name: skillName.toString(),
          familiar: Boolean(familarValue)
        }
      }
      let result = HTTP.put('http://localhost:4000/tsq/skills/users/updateFamiliarity/key/' + key, options);
      modifiedResult = result;
    } catch (e) {
      throw new Meteor.Error(e);
    }
    return modifiedResult;
  },
})
