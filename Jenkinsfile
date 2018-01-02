pipeline {
    agent {
        docker {
            image 'node:6-alpine'
            args '-p 3001:3001'
        }
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'npm install'
                sh 'meteor build . --architecture os.linux.x86_64'
            }
        }
        stage('Test') {
            echo 'Testing...'
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
            }
        }
    }
}
