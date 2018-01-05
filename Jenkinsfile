#!/usr/bin/env groovy
pipeline {
    agent {
        docker {
            image 'ulexus/meteor'
            label 'meteor-container'
        }
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'meteor npm install'
                sh 'meteor build . --architecture os.linux.x86_64'
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
            }
        }
    }
}
