import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { HelperPages } from '../../help/helperPages.js';

if (typeof Meteor.settings.public.Pages == "undefined") {
  Meteor.settings.public.Pages = {
    Base: {
      URL: "http://developerlevel.com/wp-json/wp/v2/pages/",
      Password: "",
      Context: "view",
      CacheTTL: 1
    }
  };
}
if (typeof Meteor.settings.private == "undefined") {
  Meteor.settings.private = { };
}
if (typeof Meteor.settings.private.Pages == "undefined") {
  Meteor.settings.private.Pages = {
    TSQ: {
      Slug: {
        Intro : "technical-skills-questionnaire-introduction",
        Instructions : "technical-skills-questionnaire-instructions"
      }
    }
  };
}

const POLL_INTERVAL = 1000;
const TSQ_URL = Meteor.settings.private.TSQ_URL;
const TSQ_SLUG_INTRO = Meteor.settings.private.Pages.TSQ.Slug.Intro;
const TSQ_SLUG_INSTR = Meteor.settings.private.Pages.TSQ.Slug.Instructions;
const TSQ_CACHE_TTL = Meteor.settings.public.Pages.Base.CacheTTL;

let publishedData = {};

function getKeyData (key) {
  const response = HTTP.get(`${TSQ_URL}skills/users/findOne/key/${key}`);
  console.log(response);
  return response.data.data.payload;
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
  });
});


Meteor.publish('tsq.allSkills', function (key) {
  const poll = () => {
    const apiData = HTTP.get(`${TSQ_URL}skills/`);
    const { payload } = apiData.data.data;
    payload.forEach(skill => {
      this.added('tsqskills', skill._id, skill)
    });
  }

  poll();
  this.ready();

  const interval = Meteor.setInterval(poll, 15000) // polling this less frequently 

  this.onStop(() => {
    publishedData.key = null; 
    Meteor.clearInterval(interval)
  });
});

Meteor.publish('tsq.helperTexts', function () {
  const poll = () => {
    const itms = {
      "_id": new Mongo.ObjectID()._str,
      "Intro": HelperPages.getPageContentBySlug(TSQ_SLUG_INTRO),
      "Instructions": HelperPages.getPageContentBySlug(TSQ_SLUG_INSTR)
    };
    this.added('helperText', itms._id, itms);
  }

  poll();
  this.ready();

  const interval = Meteor.setInterval(poll, TSQ_CACHE_TTL * 60000) // polling this less frequently 
  this.onStop(() => {
    publishedData.key = null; 
    Meteor.clearInterval(interval);
  });
});