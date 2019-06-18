const KeyData = new Mongo.Collection('tsqdata');
const SkillsData = new Mongo.Collection('tsqskills');

export { KeyData, SkillsData }// NOTE: need this for holding the tsq api data on the client 