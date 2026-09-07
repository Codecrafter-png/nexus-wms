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
                sh 'docker build -t $DOCKER_HUB_USER/nexus-db:$IMAGE_TAG ./database'
                sh 'docker build -t $DOCKER_HUB_USER/nexus-backend:$IMAGE_TAG ./backend'
                sh 'docker build -t $DOCKER_HUB_USER/nexus-frontend:$IMAGE_TAG ./frontend'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'
                    sh 'docker push $DOCKER_HUB_USER/nexus-db:$IMAGE_TAG'
                    sh 'docker push $DOCKER_HUB_USER/nexus-backend:$IMAGE_TAG'
                    sh 'docker push $DOCKER_HUB_USER/nexus-frontend:$IMAGE_TAG'
                }
            }
        }

        stage('Update K8s Manifests') {
            steps {
                sh "sed -i 's|$DOCKER_HUB_USER/nexus-db:.*|$DOCKER_HUB_USER/nexus-db:$IMAGE_TAG|g' k8s/db-deployment.yaml"
                sh "sed -i 's|$DOCKER_HUB_USER/nexus-backend:.*|$DOCKER_HUB_USER/nexus-backend:$IMAGE_TAG|g' k8s/backend-deployment.yaml"
                sh "sed -i 's|$DOCKER_HUB_USER/nexus-frontend:.*|$DOCKER_HUB_USER/nexus-frontend:$IMAGE_TAG|g' k8s/frontend-deployment.yaml"
            }
        }

        stage('Push Manifest Changes') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-creds', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh '''
                        git config user.email "jenkins@nexus.com"
                        git config user.name "Jenkins"
                        git add k8s/
                        git commit -m "ci: update image tags to $IMAGE_TAG"
                        git push https://$USERNAME:$PASSWORD@github.com/Codecrafter-png/nexus-wms.git main
                    '''
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
