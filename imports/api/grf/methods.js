import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

const GRF_URL = Meteor.settings.private.GRF_URL;
const TSQ_URL = Meteor.settings.private.TSQ_URL;

Meteor.methods({
  'grf.getHealthCheck'() {
    // let healthy = true;
    console.log('in grf.getHealthCheck');
    try {
      // let apiUrl = GRF_URL + 'healthCheck'; // this is the correct let apiUrl
      let apiUrl = 'http://localhost:3100/grf/' + 'healthCheck';
      apiUrl = TSQ_URL + 'skills/users/findAll/'; // temporary
      apiUrl = 'http://localhost:4000/' + 'skills/users/findAll/'; // temporary
      console.log('GRF API call ' + apiUrl);
      process.on('uncaughtException', function (err) {
        console.log('err: ', err);
      });
      console.log('after process');
      let result = HTTP.get(apiUrl);
      console.log(result);
      modifiedResult = result;
    } catch (e) {
      console.log('e: ', e);
      throw new Meteor.Error('some-error-code', 'Something bad went down');
    }
    return healthy;



    
    // let modifiedResult;
    // console.log('tsq.getAllSkills');
    // try {
    //   let result = HTTP.get(TSQ_URL + 'skills/');
    //   console.log(result);
    //   modifiedResult = result;
    // } catch (e) {
    //   console.log(e);
    //   throw new Meteor.Error('some-error-code', 'Something bad went down');
    // }
    // return modifiedResult;
  }
})