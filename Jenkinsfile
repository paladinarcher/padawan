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
                sh 'pwd'
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
