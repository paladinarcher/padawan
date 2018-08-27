#!/bin/bash

LOGFILE=meteor_startup.log
STR_SUCCESS=Started\ your\ app
STR_FAILURE=Can\'t\ start
TIMEOUT=600
RETRY_SEC=10
ELAPSED_SEC=0
until [$ELAPSED_SEC -ge $TIMEOUT]; do
	if grep -q $STR_FAILURE $LOGFILE; then
		echo "failed to start"
		exit 1
	fi
	if grep -q $STR_SUCCESS $LOGFILE; then
		echo "started successfully"
		exit 0
	fi
	sleep $RETRY_SEC
	ELAPSED_SEC+=$RETRY_SEC
done
echo "timed out"
exit 1
