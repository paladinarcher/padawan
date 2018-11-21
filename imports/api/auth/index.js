
import { Meteor } from 'meteor/meteor';  
var express = require('express');

export function setupApi() {  
  const app = express();

  app.get('/auth', (req, res) => {
    res.status(200).json({ message: 'Hello World!!!'});
  });

  WebApp.connectHandlers.use(app);
}

