#!/bin/bash

#/usr/local/bin/meteor update
#/usr/local/bin/meteor npm install @babel/runtime@7.0.0-beta.55
cat settings.dev-docker.json
export METEOR_SETTINGS="$(cat settings.dev-docker.json)"
echo $METEOR_SETTINGS
/usr/local/bin/meteor npm i
/usr/local/bin/meteor --settings settings.dev-docker.json
