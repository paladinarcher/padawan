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
                sh 'npm install'
            }
        }
    }
}
