pipeline {
    agent {
        kubernetes {
            cloud 'kubernetes'
            label 'agent-docker'
            defaultContainer 'agent-docker'
        }
    }
    stages {
        stage('Install') {
            steps {
                sh '''
                npm ci
                '''
            }
        }
        stage('Test') {
            steps {
                sh '''
                CI=true npm test
                '''
            }
        }
        stage('Publish') {
//             when {
//                 tag "release-*"
//             }
            steps {
                sh '''
                VERSION=(node -p "require('./package.json').version")
                DOCKER_ORG=helxplatform
                DOCKER_TAG=dug-search-client:$VERSION
                docker build . --no-cache --pull -t $DOCKER_ORG/$DOCKER_TAG
                '''
            }
        }
    }
}