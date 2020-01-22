#!/bin/bash
#/usr/local/bin/meteor update
/usr/local/bin/meteor --allow-superuser --settings /app/settings.staging.json

/usr/local/bin/meteor add lmieulet:meteor-coverage --allow-superuser meteortesting:mocha
/usr/local/bin/meteor npm install --save-dev babel-plugin-istanbul
