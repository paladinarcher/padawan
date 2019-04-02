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
        let apiUrl = 'http://localhost:4000/tsq/skills/users/findOne/key/' + key;
        let result = HTTP.get(apiUrl);
        console.log("TSQ API call "+apiUrl);
        console.log(result);
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
      let apiUrl = 'http://localhost:4000/tsq/skills/users/addSkills/key/' + key;
      let result = HTTP.put(apiUrl, options);
      console.log("TSQ API call "+apiUrl);
      console.log(result);
      modifiedResult = result;
    } catch (e) {
      console.log(e.response)
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
  'tsq.getAllSkills' () {
    let modifiedResult;
      try {
        let result = HTTP.get('http://localhost:4000/tsq/skills/');
        console.log(result)
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
  'tsq.removeSkillFromUser' (skillEntryArray, key) {
    let modifiedResult;
    console.log(skillEntryArray)
    try {
      let options = {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          skills: skillEntryArray
        }
      }
      let result = HTTP.put('http://localhost:4000/tsq/skills/users/removeSkills/key/' + key, options);
      modifiedResult = result;
    } catch (e) {
      console.log(e.response)
    }
    return modifiedResult;
  },
  'tsq.checkUserForSkill' (skill, key) {
    console.log("key: ", key, "skill: ", skill)
    let modifiedResult;
      try {
        let apiUrl = 'http://localhost:4000/tsq/skills/users/findSkill/key/' + key + '?skill=' + skill;
        let result = HTTP.get(apiUrl);
        console.log("TSQ API call"+apiUrl,result);
        modifiedResult = result;
      } catch (e) {
        if (e.response.statusCode === 404) {
          modifiedResult = e.response
        }
        modifiedResult = e.response
      }
      return modifiedResult;
  }
})
