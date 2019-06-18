#!/bin/bash
rm -rf .meteor/local
dos2unix *
dos2unix docker/vagrant/*
vagrant up
