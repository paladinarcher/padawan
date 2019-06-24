# <p align="center">**PROJECT PADAWAN**</p>

This is Project Padawan, a personality test tool that puts an emphasis on accuracy. This open source project is designed with the intentions of 
making you a better _you_.  

**The Latest Version**
- - - - - - - - - - - -
<p align="center"><a href="http://app.developerlevel.com">DeveloperLevel.com.</a> 


**Documentation/Information**
- - - - - - - - - -

Description | Links to the good stuff
----------- | ---------
The test plan document covers the plan for testing product. | [![Test Plan Document](https://github.com/paladinarcher/padawan/blob/master/Logo%20Pack/NotP%26A/word.png)](https://paladinarcher.atlassian.net/wiki/spaces/PP/pages/33559/Stuffs+we+upload)
The slack channel to communicate with the team.             | [![Developer Level Slack](https://github.com/paladinarcher/padawan/blob/master/Logo%20Pack/NotP%26A/slack.png)](https://developerlevel.slack.com)
Trello board for ideas/collaboration on the project.        | [![Padawan Trello](https://github.com/paladinarcher/padawan/blob/master/Logo%20Pack/NotP%26A/trello.jpg)](https://trello.com/b/7jc8dbdF)

**Requirements**
- - - - - - - - -
* Nodejs
* Meteor
* Docker

**How to**
- - - - - - - - -
Run Padawan on your localhost
1. [Install Docker here:](https://store.docker.com/search?type=edition&offering=community)
2. [Clone Padawan Repo](https://services.github.com/on-demand/github-cli/clone-repo-cli) (URL 
is above)
   * Make sure Padawan is [shared with Docker](https://docs.docker.com/docker-for-windows/#shared-drives)
3. [Run] `cd padawan`
4. `npm install`
5. `meteor reset` (gets rid of .meteor/local if exists)
6. [Run] `cd {Your Path}/padawan/docker/dev`
7. `docker-compose build`
8. `docker-compose up`
9. [Browse to localhost:3000 and see the app running](http://localhost:3000)
10. Login with the Default admin credentials: `admin@mydomain.com` and `admin`
11. Create some of your own questions here: http://localhost:3000/addQuestions/IE

**Mac and Linux Users**
- - - - - - - - - - - - 
There is an installation script available at this repository:  https://github.com/thebigtoona/padawaninstall

1. Make sure that docker, node, meteor and git are installed first 
2. Create a directory where you would like all the padawan dependencies to be installed at
and run the script according to the instructions in the README for the installation script repo

**Extra Notes**
- - - - - - - - -
1. Use Compass to edit the admin user: https://www.mongodb.com/products/compass
2. Mark the admin user email as verified.
3. Mongo is on port 3001
4. [HELP I'M A NEW DEVELOPER](https://github.com/paladinarcher/padawan/blob/documentation/NewDeveloperDocumentation/newDeveloperDocumentation.md)

**Run Nightwatch Tests**

---

Requirements
- Selenium standalone server running on port 4444 (npm is great option to install)
- Padawan running on localhost:3000

How to run
- Navigate to nightwatch.json, under `"selenium"` set `"start_process"` : `false,`
- Double check that a selenium server is running on port 4444, and padawan on localhost:3000
- `cd padawan`, and run `npm run test-e2e`

Optional
- Navigate to nightwatch.json, under `"test_settings"` > `"desiredCapabilities"` > `"chromeOptions"`, `"--headless"` can be removed to see the tests run in the browser

**Run Mocha Tests**

---

How to run
- `cd padawan`
- run `npm run test`

Note
- No need to have padawan running, `npm run test` will start up padawan on localhost:3000 and run the tests

**Licensing**
- - - - - - - -
[BSD 3 License](https://opensource.org/licenses/BSD-3-Clause)

**Contacts**
- - - - - - - 

o Sponsored by [paladinarcher.com](http://paladinarcher.com/v1/)








