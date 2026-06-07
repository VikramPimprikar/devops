pipeline {
    agent any

    stages {
        stage('Pull Code') {
            steps {
                echo 'Code pulled from GitHub'
            }
        }

        stage('Stop Old Containers') {
            steps {
                sh 'docker-compose down || true'
            }
        }

        stage('Build and Deploy') {
            steps {
                sh 'docker-compose up -d --build'
            }
        }

        stage('Show Running Containers') {
            steps {
                sh 'docker ps'
            }
        }
    }
}