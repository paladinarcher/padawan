import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

const POLL_INTERVAL = 1000;
const TSQ_URL = Meteor.settings.private.TSQ_URL

let publishedData = {};

function getKeyData (key) {
  const response = HTTP.get(`${TSQ_URL}skills/users/findOne/key/${key}`);
  return response.data.data.payload
} 

Meteor.publish('tsq.keyData', function (key) {
  const poll = () => {
    const apiData = getKeyData(key);
    const { _id, skills } = apiData;
    if (publishedData.key === apiData.key) {
      this.changed('tsqdata', _id, { _id, key, skills })
    } else {
      this.added('tsqdata', _id, { _id, key, skills })
      publishedData.key = apiData.key;
    }
  }

  poll();
  this.ready();

  const interval = Meteor.setInterval(poll, POLL_INTERVAL)

  this.onStop(() => {
    publishedData.key = null; 
    Meteor.clearInterval(interval)
  })
})
