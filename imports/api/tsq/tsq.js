import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import {Random} from 'meteor/random'
import {Class} from 'meteor/jagi:astronomy'


module.exports = {
	confidenceRubric: function() {
		let confidence = {
			'0': {
				prompt: 'No confidence information',
				value: 0,
        cssClass: 'danger'
			},
			'1': {
				prompt: 'a month or more',
				value: 1,
        cssClass: 'danger'
			},
			'2': {
				prompt: 'a week or two',
				value: 2,
        cssClass: 'warning'
			},
			'3': {
				prompt: 'a couple of days',
				value: 3,
        cssClass: 'info'
			},
			'4': {
				prompt: '8 - 10 hours',
				value: 4,
        cssClass: 'default'
			},
			'5': {
				prompt: 'a couple of hours',
        value: 5,
        cssClass: 'primary'
			},
			'6': {
				prompt: 'I could architect and give detailed technical leadership to a team today',
        value: 6,
        cssClass: 'success' 
			}
		};
		return confidence;
  },
  confidenceToBootstrapClass: function (confidence) {
    return confidenceRubric()[confidence].cssClass;
  },
	removeSkillFromUser: async function (SkillEntryarray, key, callback) {
		let success = true;
		await Meteor.call(
		  'tsq.removeSkillFromUser',
		  SkillEntryarray,
		  key,
		  (error, result) => {
			if (error) {
				console.info({error});
				success = false;
			} else {
				console.info({result})
			}
			let $select = $('#skills-selecttsq');
			if($select.length) {
				$select[0].selectize.enable();
			}
			$('#continue').attr('disabled',false);
			if(callback) {
				callback();
			}
		  }
		);
		return success;
	},
	registerUser: async function (user) {
		let key;
		await Meteor.call(
			'tsq.registerKeyToUser',
			(error,result) => {
				if (error) {
					console.info({error});
					success = false;
				} else {
					console.info({result})
					key = result.data.data.key;
				}
			}
		);
		user.registerTechnicalSkillsDataKey(key)
		return key;
	}, 
	addSkillsToUser: async function (skillsToAdd, key, callback) {
		let success = true;
		await Meteor.call('tsq.addSkillToUser', skillsToAdd, key, (error, result) => {
		  if (error) {
			console.warn('METEOR CALL ERROR: ', error);
			success = false;
		  } else {
			console.info({ result });
		  }
		  let $select = $('#skills-selecttsq');
		  if($select.length) {
			$select[0].selectize.enable();
		  }
		  $('#continue').attr('disabled',false);
		  if(callback) {
			callback();
		  }
		});
		return success;
	},
	updateSkillFamiliarSetting: async function (key, skillId, familiar, callback) {
		let success = true;
		await Meteor.call(
		  'tsq.updateFamiliarInformation',
		  key,
		  skillId,
		  familiar,
		  (error, result) => {
			if(error) {
				console.info({error});
				success = false;
			} else {
				console.info({result});
			}
			let $select = $('#skills-selecttsq');
			if($select.length) {
				$select[0].selectize.enable();
			}
			$('#continue').attr('disabled',false);
			if(callback) {
				 callback();
			}
		  }
		);
		return success;
	},
	updateConfidenceLevel: async function (skill, confidenceLevel, key) {
		let success = true;
		await Meteor.call(
			'tsq.updateConfidenceLevel',
			skill._id,
			confidenceLevel,
			key,
			(error, result) => {
				if(error) {
					console.info({error});
					success = false;
				} else {
					console.info({result});
				}
			}
		);
		return success;
	},
	saveUserSkills: async function(addSkills, removeSkills, key, callback) {
		console.log("Saving SKILLS", addSkills, removeSkills, key);
		let cur = this;
		await this.addSkillsToUser(addSkills, key, function(){
			cur.removeSkillFromUser(removeSkills, key, function(){
				if(callback) {
					callback();
				}
			});
		});
	},
	zeroConfidenceSkills: function (kd) {
		let res = (kd) ? kd.skills.filter(skill => skill.confidenceLevel === 0) : [];
		return res;
	},
	unfamiliarSkills: function (kd) {
		let res = (kd) ? kd.skills.filter(skill => skill.familiar === false) : [];
		return res;
	},
	familiarSkills: function (kd) {
		let res = (kd) ? kd.skills.filter(skill => skill.familiar === true) : [];
		return res;
	},
	totalSkills: function (kd) {
		let res = (kd) ? kd.skills : [];
		return res;
	},
	unansweredPercent: function (kd) {
		let zeroSkills = this.zeroConfidenceSkills(kd);
		let totalSkills = this.totalSkills(kd);

		let newSkillsCount = zeroSkills.length;
		let hasUnfamiliar = totalSkills.filter(skill => skill.familiar === false);

		if (hasUnfamiliar.length === 0 && newSkillsCount === 0) {
			newSkillsCount += 2;
		} else if (hasUnfamiliar.length === 0) {
			newSkillsCount++;
		}	

		return (newSkillsCount === 0) ? 0  : (newSkillsCount / (totalSkills.length + 2)) * 100;
	},
}