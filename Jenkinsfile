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
    environment {
        LC_ALL='en_US.UTF-8'
    }
    stages {
        /*stage('Unit Tests') {
            steps {
                echo 'Testing...'
                sh 'locale'
                sh 'echo "LC_ALL=en_US.UTF-8" >> /etc/environment'
                sh 'echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen'
                sh 'echo "LANG=en_US.UTF-8" > /etc/locale.conf'
                sh 'locale-gen en_US.UTF-8'
                sh 'meteor --allow-superuser remove-platform android'
                sh 'meteor --allow-superuser npm install --save babel-runtime nightwatch'
                sh 'meteor --allow-superuser test --once --driver-package meteortesting:mocha'
            }
        }*/
        stage('Functional Tests') {
            steps {
                sh 'locale'
                sh 'echo "LC_ALL=en_US.UTF-8" >> /etc/environment'
                sh 'echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen'
                sh 'echo "LANG=en_US.UTF-8" > /etc/locale.conf'
                sh 'locale-gen en_US.UTF-8'
                //sh 'java -jar /opt/selenium/selenium-server-standalone.jar &'
                sh 'meteor --allow-superuser npm install --save babel-runtime nightwatch'
                sh 'meteor --allow-superuser &'
                sh 'sleep 4m'
                sh 'curl http://localhost:3000/'
                sh 'meteor --allow-superuser npm run test-e2e'
            }
        }
        stage('Build') {
            steps {
                echo "Building... ${env.JOB_NAME}"
                sh 'meteor --allow-superuser build /tmp --architecture os.linux.x86_64'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                sh "scp -o StrictHostKeyChecking=no -i /home/.ssh/rigel-alpha.pem /tmp/${env.JOB_NAME}.tar.gz ec2-user@18.218.174.233:/home/ec2-user/docker/staging/padawan.tar.gz"
                sh "ssh -o StrictHostKeyChecking=no -i /home/.ssh/rigel-alpha.pem ec2-user@18.218.174.233 /home/ec2-user/bin/staging-rebuild-up.sh"
            }
        }
    }
}
