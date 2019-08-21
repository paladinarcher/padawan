import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import {Random} from 'meteor/random'
import {Class} from 'meteor/jagi:astronomy'


module.exports = {
	ConfidenceRubric: function() {
		let confidence = {
			'0': {
				prompt: 'unfamilar',
				value: 0
			},
			'1': {
				prompt: 'a month or more',
				value: 1
			},
			'2': {
				prompt: 'a week or two',
				value: 2
			},
			'3': {
				prompt: 'a couple of days',
				value: 3
			},
			'4': {
				prompt: '8 to 10 hours',
				value: 4
			},
			'5': {
				prompt: 'a couple of hours',
				value: 5
			},
			'6': {
				prompt: 'I could architect and give detailed technical leadership to a team today',
				value: 6
			}
		};
		return confidence;
	},
	removeSkillFromUser: async function (SkillEntryarray, key) {
		let success = true;
		Meteor.call(
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
	addSkillsToUser: async function (skillsToAdd, key) {
		let success = true;
		await Meteor.call('tsq.addSkillToUser', skillsToAdd, key, (error, result) => {
		  if (error) {
			console.warn('METEOR CALL ERROR: ', error);
			success = false;
		  } else {
			console.info({ result });
		  }
		});
		return success;
	},
	updateSkillFamiliarSetting: async function (key, skillId, familiar) {
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
		  }
		);
		return success;
	},
	addUnfamiliarSkillsToUser: async function (counter, unfamiliarInfo, allSkills, userData) {
		if (counter < 10) {
		  	const usersSkillsById = userData.skills.map(skill => skill._id);
		  	const filteredSkills = allSkills.filter(skill => !usersSkillsById.includes(skill._id));

		  	const skillsToAdd = [];
			while (skillsToAdd.length < (10-counter)) {
				const randomSkill = filteredSkills[Math.floor(Math.random()*filteredSkills.length)]
				const ids = skillsToAdd.map(skill => skill._id)
				if (!ids.includes(randomSkill._id)) {
					skillsToAdd.push(randomSkill)
				} else {
					continue
				}
			}
	  
		  	const usersSkills = userData.skills.map(skill => {
				const { _id, familiar, confidenceLevel } = skill;
				const { name } = skill.name
				return { id: _id, name, familiar, confidenceLevel }
		  	});
	  
			const updateArray = skillsToAdd.map(skill => { return { id: skill._id, name: skill.name, familiar: false } })
		
			unfamiliarInfo = {
				unfamiliars: [...unfamiliarInfo, ...updateArray],
				count: 10
			};
		
			await this.addSkillsToUser([...usersSkills, ...updateArray], userData.key);
		}
		return unfamiliarInfo;
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
	}
}