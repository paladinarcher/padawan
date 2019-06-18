import {Meteor} from 'meteor/meteor'
import { HTTP } from 'meteor/http';

//var Airtable = require('airtable');
//Airtable.configure({
//    endpointUrl: 'https://api.airtable.com',
//    apiKey: 'keynpUHJS7l5QFWfQ'
//});
//var base = Airtable.base('appXlqlAQhi8cedpP');

// const AT_URL = "https://api.airtable.com/v0/appXlqlAQhi8cedpP/";
// const AT_KEY = "keynpUHJS7l5QFWfQ";

function auth(method, endpoint, request, params) {
    let h = {
        "Authorization" : "Bearer "+AT_KEY
    };
    if(method === 'PUT' || method === 'POST' || method === 'PATCH') {
        h = {
            "Authorization" : "Bearer "+AT_KEY,
            "Content-Type" : 'application/json'
        };
    }
    result = HTTP.call(method, AT_URL+endpoint, {
        headers: h,
        data: request,
        params: params
    });
    return result;
}

module.exports.getResult = auth;