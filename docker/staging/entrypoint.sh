#!/bin/bash

export METEOR_SETTINGS="$(cat settings.staging.json)"
echo $METEOR_SETTINGS
forever main.js
