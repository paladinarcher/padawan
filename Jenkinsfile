#!/usr/bin/env groovy
pipeline {
    agent {
        dockerfile {
            filename "Dockerfile-jenkins-build"
            args "--entrypoint=''"
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
        LANG='en_US.UTF-8'
        METEOR_ALLOW_SUPERUSER=true
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
                sh 'meteor --allow-superuser test --once --driver-package meteortesting:mocha'
            }
        }
        stage('Functional Tests') {
            steps {
                sh 'echo "LC_ALL=en_US.UTF-8" >> /etc/environment'
                sh 'echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen'
                sh 'echo "LANG=en_US.UTF-8" > /etc/locale.conf'
                sh 'locale-gen en_US.UTF-8'
		sh 'meteor --allow-superuser reset'
                sh 'meteor --allow-superuser > meteor_startup.log 2>&1 &'
		sh 'sh -c ./pipeline/meteor_wait.sh'
                //sh 'sleep 8m'
		sh 'cat meteor_startup.log'
		sh 'free -m'
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
                //sh "scp -o StrictHostKeyChecking=no -i /home/.ssh/rigel-alpha.pem /tmp/${env.BUILD_ID}.tar.gz ec2-user@18.218.174.233:/home/ec2-user/docker/staging/padawan.tar.gz"
                sh "scp -o StrictHostKeyChecking=no -i /home/.ssh/rigel-alpha.pem `ls -1 /tmp/${env.JOB_NAME}*.tar.gz | head -n 1` ec2-user@18.218.174.233:/home/ec2-user/docker/production/padawan.tar.gz"
                sh "ssh -o StrictHostKeyChecking=no -i /home/.ssh/rigel-alpha.pem ec2-user@18.218.174.233 /home/ec2-user/bin/production-rebuild-up.sh"
            }
        }
    }
}
