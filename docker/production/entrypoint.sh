#!/bin/bash
  
export METEOR_SETTINGS="$(cat settings.prod.json)"
echo $METEOR_SETTINGS
forever main.js
