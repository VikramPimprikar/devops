pipeline {
    agent any

    stages {
        stage('Clean Old Containers') {
            steps {
                sh '''
                docker rm -f food-postgres user-service restaurant-service order-service payment-service notification-service api-gateway food-frontend node-exporter prometheus grafana || true
                docker network rm food-microservice-pipeline_default || true
                '''
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh 'docker-compose up -d --build'
            }
        }

        stage('Show Containers') {
            steps {
                sh 'docker ps'
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh 'trivy fs . || true'
            }
        }
    }
}