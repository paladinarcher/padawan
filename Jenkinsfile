#!/usr/bin/env groovy
pipeline {
    agent {
        docker {
            image 'golden/meteor-dev'
            args '-e SRC_DIR=/var/jenkins_home/workspace/padawan-ci-beta'
        }
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'pwd'
                sh 'ls -la'
                sh 'whereis meteor'
                sh 'meteor remove-platform android'
                sh 'meteor npm install --save babel-runtime'
                sh 'meteor build /tmp --architecture os.linux.x86_64'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                sh 'scp -i /home/.ssh/rigel-alpha.pem /tmp/padawan.tar.gz ec2-user@18.221.137.142:/home/ec2-user/docker/staging/'
            }
        }
    }
}
