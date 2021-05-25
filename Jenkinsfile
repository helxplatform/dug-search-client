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
                make install.ci
                '''
            }
        }
        stage('Test') {
            steps {
                sh '''
                make test.ci
                '''
            }
        }
        stage('Publish') {
            when {
                buildingTag()
            }
            steps {
                sh '''
                make publish
                '''
            }
        }
    }
}