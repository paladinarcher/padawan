#!/usr/bin/env groovy
pipeline {
    agent {
        dockerfile {
            filename "Dockerfile-jenkins-build"
        }
        /*
        docker {
            image 'golden/meteor-dev'
            args '-e SRC_DIR=/var/jenkins_home/workspace/padawan-ci-beta'
        }
        */
    }
    stages {
        stage('Build') {
            steps {
                echo "Building... ${env.JOB_NAME}"
                //sh 'meteor --allow-superuser remove-platform android'
                //sh 'meteor --allow-superuser npm install --save babel-runtime'
                //sh 'meteor --allow-superuser build /tmp --architecture os.linux.x86_64'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
                //sh 'meteor --allow-superuser test'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                sh 'ls -ltrh /tmp'
                //sh "scp -o StrictHostKeyChecking=no -i /home/.ssh/rigel-alpha.pem /tmp/${env.JOB_NAME}.tar.gz ec2-user@18.221.137.142:/home/ec2-user/docker/staging/padawan.tar.gz"
                sh "ssh -o StrictHostKeyChecking=no -i /home/.ssh/rigel-alpha.pem ec2-user@18.221.137.142 /home/ec2-user/bin/staging-rebuild-up.sh"
            }
        }
    }
}
