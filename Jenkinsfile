pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'mohamedashfaq'
        IMAGE_TAG = "v${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Codecrafter-png/nexus-wms.git'
            }
        }

        stage('Build Images') {
            steps {
                bat "docker build -t %DOCKER_HUB_USER%/nexus-db:%IMAGE_TAG% ./database"
                bat "docker build -t %DOCKER_HUB_USER%/nexus-backend:%IMAGE_TAG% ./backend"
                bat "docker build -t %DOCKER_HUB_USER%/nexus-frontend:%IMAGE_TAG% ./frontend"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    bat "echo %PASSWORD% | docker login -u %USERNAME% --password-stdin"
                    bat "docker push %DOCKER_HUB_USER%/nexus-db:%IMAGE_TAG%"
                    bat "docker push %DOCKER_HUB_USER%/nexus-backend:%IMAGE_TAG%"
                    bat "docker push %DOCKER_HUB_USER%/nexus-frontend:%IMAGE_TAG%"
                }
            }
        }

        stage('Update K8s Manifests') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-creds', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    bat """
                        powershell -Command "(Get-Content k8s/db-deployment.yaml) -replace '%DOCKER_HUB_USER%/nexus-db:.*', '%DOCKER_HUB_USER%/nexus-db:%IMAGE_TAG%' | Set-Content k8s/db-deployment.yaml"
                        powershell -Command "(Get-Content k8s/backend-deployment.yaml) -replace '%DOCKER_HUB_USER%/nexus-backend:.*', '%DOCKER_HUB_USER%/nexus-backend:%IMAGE_TAG%' | Set-Content k8s/backend-deployment.yaml"
                        powershell -Command "(Get-Content k8s/frontend-deployment.yaml) -replace '%DOCKER_HUB_USER%/nexus-frontend:.*', '%DOCKER_HUB_USER%/nexus-frontend:%IMAGE_TAG%' | Set-Content k8s/frontend-deployment.yaml"
                        git config user.email "jenkins@nexus.com"
                        git config user.name "Jenkins"
                        git add k8s/
                        git commit -m "ci: update image tags to %IMAGE_TAG%"
                        git push https://%USERNAME%:%PASSWORD%@github.com/Codecrafter-png/nexus-wms.git main
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
