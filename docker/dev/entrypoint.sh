#!/bin/bash
/usr/local/bin/meteor update --all-packages
/usr/local/bin/meteor npm install @babel/runtime@latest
/usr/local/bin/meteor run --settings /app/settings.dev-docker.json
