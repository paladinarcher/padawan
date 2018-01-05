#!/usr/bin/env groovy
pipeline {
    agent {
        docker {
            image 'ulexus/meteor'
        }
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
                sh '/home/bin/padawan-build.sh'
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
