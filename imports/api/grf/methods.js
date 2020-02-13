import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

// const GRF_URL = Meteor.settings.private.GRF_URL;
const GRF_URL = Meteor.settings.public.GRF_URL;

Meteor.methods({
  'grf.getHealthCheck'() {
    let healthy = true;
    try {
      let apiUrl = GRF_URL + 'healthCheck/';
      let result = HTTP.get(apiUrl);
      if (result.statusCode !== 200) {
        healthy = false;
      }
    } catch (e) {
      healthy = false;
    }
    return healthy;
  }
})
