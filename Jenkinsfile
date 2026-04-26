pipeline {
    agent any

    environment {
        GIT_REPO       = 'https://github.com/hibachabbouh/Tp4Devops.git'
        GIT_BRANCH     = 'main'
        SONAR_HOST_URL = 'http://sonarqube:9000'
        // SonarQube token provided (embedded here per request).
        SONAR_TOKEN    = 'sqp_c14254d9202fe26e0be713dd0ab70e1475558fe3'
        SONAR_PROJECT  = 'mon-app-devops'
    }

    tools {
        nodejs 'NodeJS-18'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: "${GIT_BRANCH}", url: "${GIT_REPO}"
                echo "Checked out ${GIT_REPO} @ ${GIT_BRANCH}"
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('app') {
                    sh 'npm ci'
                }
            }
        }

        stage('Unit Tests') {
            steps {
                dir('app') {
                    sh 'npm run test:ci'
                }
            }
            post {
                always {
                    junit 'app/coverage/junit.xml'
                    archiveArtifacts artifacts: 'app/coverage/lcov.info', onlyIfSuccessful: false
                }
            }
        }

        stage('Static Analysis - SonarQube') {
            steps {
                dir('app') {
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=${SONAR_PROJECT} \
                          -Dsonar.sources=src \
                          -Dsonar.tests=tests \
                          -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                          -Dsonar.host.url=${SONAR_HOST_URL} \
                          -Dsonar.login=${SONAR_TOKEN}
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }

    post {
        success { echo 'CI (Exercice 1) réussi.' }
        failure { echo 'CI (Exercice 1) échoué — vérifier les logs et SonarQube Quality Gate.' }
        always { cleanWs() }
    }
}
