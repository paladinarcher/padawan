import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

const GRF_URL = Meteor.settings.private.GRF_URL;

Meteor.methods({
    'grf.getHealthCheck'() {
        let healthy = true;
        console.log('in grf.getHealthCheck');
        try {
          let apiUrl = GRF_URL + 'healthCheck';
          console.log('GRF API call ' + apiUrl);
          let result = HTTP.get(apiUrl);
          console.log(result);
          modifiedResult = result;
        } catch (e) {
          throw new Meteor.Error('some-error-code', 'Something bad went down');
        }
        return healthy;
    }
})