const KeyData = new Mongo.Collection('tsqdata');
const SkillsData = new Mongo.Collection('tsqskills');
const HelpText = new Mongo.Collection('helperText');

export { KeyData, SkillsData, HelpText }// NOTE: need this for holding the tsq api data on the client 