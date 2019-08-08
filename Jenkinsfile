#!/usr/bin/env groovy

void setBuildStatus(String message, String state) {
  step([
      $class: "GitHubCommitStatusSetter",
      reposSource: [$class: "ManuallyEnteredRepositorySource", url: "https://github.com/paladinarcher/padawan"],
      contextSource: [$class: "ManuallyEnteredCommitContextSource", context: "ci/jenkins/build-status"],
      errorHandlers: [[$class: "ChangingBuildStatusErrorHandler", result: "UNSTABLE"]],
      statusResultSource: [ $class: "ConditionalStatusResultSource", results: [[$class: "AnyBuildResult", message: message, state: state]] ]
  ]);
}

pipeline {
    agent {
        dockerfile {
            filename "Dockerfile-jenkins-build"
            args "--entrypoint=''"
        }
    }
    environment {
        LC_ALL='en_US.UTF-8'
        LANG='en_US.UTF-8'
        METEOR_ALLOW_SUPERUSER=true
        NODE_ENV='development'
    }
    stages {
        stage('Unit Tests') {
            steps {
                echo 'Testing...'
                sh 'echo "LC_ALL=en_US.UTF-8" >> /etc/environment'
                sh 'echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen'
                sh 'echo "LANG=en_US.UTF-8" > /etc/locale.conf'
                sh 'locale-gen en_US.UTF-8'
                //sh 'meteor --allow-superuser remove-platform android'
                sh 'meteor npm --allow-superuser install --save babel-runtime nightwatch'
                sh 'meteor --allow-superuser test --once --settings settings.prod.json --driver-package meteortesting:mocha'
            }
        }
        stage('Functional Tests') {
            steps {
                sh 'java -jar /opt/selenium/selenium-server-standalone.jar > selenium_startup.log 2>&1 &'
                sh 'meteor --allow-superuser reset'
                sh 'meteor --allow-superuser > meteor_startup.log 2>&1 &'
                sh '''
                    LOGFILE=meteor_startup.log
                    STR_SUCCESS="Started your app"
                    STR_FAILURE="Can't start"
                    STR_FAILURE2="Your application has errors"
                    STR_FAILURE3="Waiting for file change"
                    TIMEOUT=600
                    RETRY_SEC=10
                    ELAPSED_SEC=0
                    until [ "$ELAPSED_SEC" -ge "$TIMEOUT" ]; do
                    	if grep -q "$STR_FAILURE" $LOGFILE; then
                    		echo "failed to start"
                            cat $LOGFILE
                    		exit 1
                    	fi
                        if grep -q "$STR_FAILURE2" $LOGFILE; then
                    		echo "failed to start"
                            cat $LOGFILE
                    		exit 1
                    	fi
                        if grep -q "$STR_FAILURE3" $LOGFILE; then
                    		echo "failed to start"
                            cat $LOGFILE
                    		exit 1
                    	fi
                    	if grep -q "$STR_SUCCESS" $LOGFILE; then
                    		echo "started successfully"
                    		exit 0
                    	fi
                    	sleep $RETRY_SEC
                    	echo $((ELAPSED_SEC+=$RETRY_SEC))
                    done
                    echo "timed out"
                    exit 1
                '''
                sh 'cat selenium_startup.log'
                sh 'cat meteor_startup.log'
                sh 'meteor npm --allow-superuser run test-e2e'
            }
        }
        stage('Build') {
            steps {
                echo "Building... ${env.JOB_NAME} ${env.BUILD_ID}"
                sh 'meteor --allow-superuser build /tmp --architecture os.linux.x86_64'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying... '
                sh "ls -ltrh /tmp"
                sh "scp -o StrictHostKeyChecking=no -i /home/.ssh/rigel-alpha.pem settings.staging.json ec2-user@18.218.174.233:/home/ec2-user/docker/stage/settings.staging.json"
                sh "scp -o StrictHostKeyChecking=no -i /home/.ssh/rigel-alpha.pem `ls -1 /tmp/${env.JOB_NAME}*.tar.gz | head -n 1` ec2-user@18.218.174.233:/home/ec2-user/docker/stage/padawan.tar.gz"
                sh "ssh -o StrictHostKeyChecking=no -i /home/.ssh/rigel-alpha.pem ec2-user@18.218.174.233 /home/ec2-user/bin/production-rebuild-up.sh"
            }
        }
    }
    post {
      success {
        setBuildStatus("Build complete.", "SUCCESS")
        //slackSend "Build Succeeded - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
      }
      failure {
        setBuildStatus("Build failed.", "FAILURE")
        //slackSend "Build FAILED! - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
      }
    }
}
