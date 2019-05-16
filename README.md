# <p align="center">**PROJECT PADAWAN**</p>

This is Project Padawan, a personality test tool that puts an emphasis on accuracy. This open source project is designed with the intentions of
making you a better _you_.

**The Latest Version**

---

<p align="center"><a href="http://app.developerlevel.com">DeveloperLevel.com.</a>

**Documentation/Information**

---

| Description                                                 | Links to the good stuff                                                                                                                                                                      |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The test plan document covers the plan for testing product. | [![Test Plan Document](https://github.com/paladinarcher/padawan/blob/master/Logo%20Pack/NotP%26A/word.png)](https://paladinarcher.atlassian.net/wiki/spaces/PP/pages/33559/Stuffs+we+upload) |
| The slack channel to communicate with the team.             | [![Developer Level Slack](https://github.com/paladinarcher/padawan/blob/master/Logo%20Pack/NotP%26A/slack.png)](https://developerlevel.slack.com)                                            |
| Trello board for ideas/collaboration on the project.        | [![Padawan Trello](https://github.com/paladinarcher/padawan/blob/master/Logo%20Pack/NotP%26A/trello.jpg)](https://trello.com/b/7jc8dbdF)                                                     |

**Requirements**

---

- Nodejs
- Meteor
- Docker
- [AARC](https://github.com/paladinarcher/aarc)
- [TSQ](https://github.com/paladinarcher/TSQ-Microservice)

**How to**

---

_Prerequisites:_

- _the aarc and tsq microservices need to be running with docker for padawan to start up and function using docker_
- _you'll need to set up a [docker network](https://docs.docker.com/engine/reference/commandline/network_create/) as well for this to run. it should be named `devlvl_net`_

Run Padawan on your localhost

1. [Install Docker here:](https://store.docker.com/search?type=edition&offering=community)
2. [Clone Padawan Repo](https://services.github.com/on-demand/github-cli/clone-repo-cli) (URL
   is above)
   - Make sure Padawan is [shared with Docker](https://docs.docker.com/docker-for-windows/#shared-drives)
3. [Run] `cd padawan`
4. `meteor npm install`
5. `meteor reset` (gets rid of .meteor/local if exists)
6. [Run] `cd {Your Path}/padawan/docker/dev`
7. `docker-compose build`
8. `docker-compose up`
9. [Browse to localhost:3000 and see the app running](http://localhost:3000)
10. Login with the Default admin credentials: `admin@mydomain.com` and `admin`
11. Create some of your own questions here: http://localhost:3000/addQuestions/IE

**Extra Notes**

---

1. Use Compass to edit the admin user: https://www.mongodb.com/products/compass
2. Mark the admin user email as verified.
3. Mongo is on port 3001
4. [HELP I'M A NEW DEVELOPER](https://github.com/paladinarcher/padawan/blob/documentation/NewDeveloperDocumentation/newDeveloperDocumentation.md)

**Licensing**

---

[BSD 3 License](https://opensource.org/licenses/BSD-3-Clause)

**Contacts**

---

o Sponsored by [paladinarcher.com](http://paladinarcher.com/v1/)
