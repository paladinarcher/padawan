#!/usr/bin/env groovy

void setBuildStatus(String message, String state) {
  step([
      $class: "GitHubCommitStatusSetter",
      reposSource: [$class: "ManuallyEnteredRepositorySource", url: "https://github.com/paladinarcher/padawan"],
      contextSource: [$class: "ManuallyEnteredCommitContextSource", context: "ci/jenkins/build-status"],
      errorHandlers: [[$class: "ChangingBuildStatusErrorHandler", result: "UNSTABLE"]],
      statusResultSource: [ $class: "ConditionalStatusResultSource", results: [[$class: "AnyBuildResult", message: message, state: state]] ]
  ]);
}

pipeline {
    agent {
        dockerfile {
            filename "Dockerfile-jenkins-build"
            args "--entrypoint=''"
        }
    }
    environment {
        LC_ALL='en_US.UTF-8'
        LANG='en_US.UTF-8'
        METEOR_ALLOW_SUPERUSER=true
        NODE_ENV='development'
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
                sh 'meteor --allow-superuser test --once --settings settings.prod.json --driver-package meteortesting:mocha'
            }
        }
        stage('Functional Tests') {
            steps {
                sh 'java -jar /opt/selenium/selenium-server-standalone.jar > selenium_startup.log 2>&1 &'
                sh 'meteor --allow-superuser reset'
                sh 'meteor --allow-superuser > meteor_startup.log 2>&1 &'
                sh '''
                    LOGFILE=meteor_startup.log
                    STR_SUCCESS="Started your app"
                    STR_FAILURE="Can't start"
                    STR_FAILURE2="Your application has errors"
                    STR_FAILURE3="Waiting for file change"
                    TIMEOUT=600
                    RETRY_SEC=10
                    ELAPSED_SEC=0
                    until [ "$ELAPSED_SEC" -ge "$TIMEOUT" ]; do
                    	if grep -q "$STR_FAILURE" $LOGFILE; then
                    		echo "failed to start"
                            cat $LOGFILE
                    		exit 1
                    	fi
                        if grep -q "$STR_FAILURE2" $LOGFILE; then
                    		echo "failed to start"
                            cat $LOGFILE
                    		exit 1
                    	fi
                        if grep -q "$STR_FAILURE3" $LOGFILE; then
                    		echo "failed to start"
                            cat $LOGFILE
                    		exit 1
                    	fi
                    	if grep -q "$STR_SUCCESS" $LOGFILE; then
                    		echo "started successfully"
                    		exit 0
                    	fi
                    	sleep $RETRY_SEC
                    	echo $((ELAPSED_SEC+=$RETRY_SEC))
                    done
                    echo "timed out"
                    exit 1
                '''
                sh 'cat selenium_startup.log'
                sh 'cat meteor_startup.log'
                sh 'meteor npm --allow-superuser run test-e2e'
            }
        }
        stage('Istanbul') {
            steps {
				script {
					env.JUNIT_REPORT_PATH = 'reports/report.xml'
					// env.JUNIT_REPORT_PATH = '/report.xml'
				}
				//echo "${env.JUNIT_REPORT_PATH}" 

                // beggining of xml report tags
				sh "cd $WORKSPACE"
				sh '''
					cd $WORKSPACE
					rm -rf reports
					mkdir reports
					touch ./reports/report.xml
					echo '<testsuites name="Mocha Tests">' >> ./reports/report.xml
					echo '	<testsuite name="For Jenkins" tests="3" errors="0" failures="0" skipped="0" timestamp="2019-11-26T21:32:43" time="0.004">' >> ./reports/report.xml
				'''
				//sh "cat reports/report.xml"

				sh '/usr/local/bin/meteor npm install istanbul'
				echo 'Istanbul installed'
				sh 'set +e' // this should help Jenkins not crash
				sh '/usr/local/bin/meteor npm run coverage:unit || true'
				sh 'set -e' // this should help Jenkins not crash
				echo 'coverage:unit script ran'

                // middle of xml report tags
				sh '''
					failingTest='false'
					linePrint () 
					{
						myReg=$(echo $1 | awk 'match($0, /pic high|pic low/) {print substr($0, RSTART, RLENGTH)}')
						coverageName=$(echo $2 | awk 'match($0, /data-value="[a-zA-Z0-9\\/\\_\\-\\#\\$\\.]+/) {print substr($0, RSTART + 12, RLENGTH - 12)}')
						percent=$(echo $1 | awk 'match($0, /data-value="[0-9][0-9].[0-9][0-9]|data-value="[0-9][0-9][0-9]|data-value="[0-9][0-9]/) {print substr($0, RSTART + 12, RLENGTH - 12)}')
						myName='name="'$myReg' '$percent'% coverage: '$coverageName'"'
						qt='"'

						if [ "$myReg" = "pic high" ] 
						then
							echo "MYREG is pic high"
							echo "      <testcase classname=${qt}Istanbul Coverage$qt $myName time=${qt}0$qt>" >> ./reports/report.xml
							echo "			<system-out><![CDATA[$1 $2]]></system-out>" >> ./reports/report.xml
							echo '		</testcase>' >> ./reports/report.xml
						elif [ "$myReg" = "pic low" ]
						then
							echo "MYREG is pic low"
							failingTest='true'
							echo "      <testcase classname=${qt}Istanbul Coverage$qt $myName time=${qt}0$qt status=${qt}Failed$qt>" >> ./reports/report.xml
							echo '			<failure message="Coverage Percentage is below 80%"></failure>' >> ./reports/report.xml
							echo "			<system-out><![CDATA[$1 $2]]></system-out>" >> ./reports/report.xml
							echo '		</testcase>' >> ./reports/report.xml
						elif [ "$myReg" = "" ];
						then
							echo "MYREG is empty"
						fi

						echo "==============================\n"
					}
					
					prevLine='none'
					while read -r line; do linePrint "$line" "$prevLine"; prevLine="$line"; done < .coverage/index.html
				'''

                // closing of xml report tags
				sh '''
					echo '	</testsuite>' >> ./reports/report.xml
					echo '</testsuites>' >> ./reports/report.xml
				'''
				
				// If there is an istanbul test below 80%, the folowing code should fail the pipeline
				sh 'echo $failingTest'
				sh '''
					if [ "$failingTest" = "true" ] 
					then
						false
					fi
				'''
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
                sh "scp -o StrictHostKeyChecking=no -i /home/.ssh/rigel-alpha.pem settings.staging.json ec2-user@18.218.174.233:/home/ec2-user/docker/stage/settings.staging.json"
                sh "scp -o StrictHostKeyChecking=no -i /home/.ssh/rigel-alpha.pem `ls -1 /tmp/${env.JOB_NAME}*.tar.gz | head -n 1` ec2-user@18.218.174.233:/home/ec2-user/docker/stage/padawan.tar.gz"
                sh "ssh -o StrictHostKeyChecking=no -i /home/.ssh/rigel-alpha.pem ec2-user@18.218.174.233 /home/ec2-user/bin/production-rebuild-up.sh"
            }
        }
		stage('HealthCheck') {
			steps {
                sh '''
                    sleep 20
                    response=$(curl --write-out %{http_code} --silent --output /dev/null http://stage.developerlevel.com/healthCheck)
                    if [ $response = "209" ]; then
                        echo 'Health check was successful'
                    else
                        echo 'Health check was not successful'
                        false
                    fi
                '''
			}
		}
    }
    post {
        always {
            // sh "cat ${env.JUNIT_REPORT_PATH}"
            // echo "${env.JUNIT_REPORT_PATH}"
            junit "${env.JUNIT_REPORT_PATH}"
        }
        success {
            setBuildStatus("Build complete.", "SUCCESS")
            script {
                commitId = sh(returnStdout: true, script: "git rev-parse HEAD")
                userEmail = sh(returnStdout: true, script: "git show -s --format='%ae' $commitId")
                commitMsg = sh(returnStdout: true, script: "git show -s --format=%B $commitId")

                slackMsg = "Build Succeeded - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)\n"
                slackMsg += "Built using the Jenkins (staging) pipeline\n"
                slackMsg += "Build User email: $userEmail"
                slackMsg += "Commit Id: $commitId".trim() + "\n"
                slackMsg += "Commit Message: $commitMsg"

                //echo "$slackMsg"
            }
            slackSend (color: '#00FF00', message: "$slackMsg")
            cleanWs()
        }
        failure {
            setBuildStatus("Build failed.", "FAILURE")
            script {
                commitId = sh(returnStdout: true, script: "git rev-parse HEAD")
                userEmail = sh(returnStdout: true, script: "git show -s --format='%ae' $commitId")
                commitMsg = sh(returnStdout: true, script: "git show -s --format=%B $commitId")

                slackMsg = "Build FAILED! - ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)\n"
                slackMsg += "Built using the Jenkins (staging) pipeline\n"
                slackMsg += "Build User email: $userEmail"
                slackMsg += "Commit Id: $commitId".trim() + "\n"
                slackMsg += "Commit Message: $commitMsg"

                //echo "$slackMsg"
            }
            slackSend (color: '#FF0000', message: "$slackMsg")
            cleanWs()
        }
    }
}
