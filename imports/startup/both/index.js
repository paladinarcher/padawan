// Import modules used by both client and server through a single index entry point
// e.g. useraccounts configuration file.
if(Meteor.isClient) { Session.setDefault('refreshQuestions', Math.random()); }
import './at_config.js';