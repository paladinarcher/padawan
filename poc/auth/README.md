# <p align="center">**User Authentication API**</p>

This application contains an authentication API prototype which implements the following specification:

```
 It doesn't work with the existing padawan application. It must perform the following:

- receive authentication information and respond properly (including 
  returning success/failure/whatever else needs returning)

- receive some sort of user identifier and return whether that user 
  is logged in

- receive some sort of user identifier and return basic demographic 
  info

- receive some sort of user identifier and return global user roles 
  (admin, etc; Team roles are not necessary)
```

##Getting started

First, run "npm install" to install all of the dependencies.

Create one or more MongoDB instances, two if you wish to use the test suite without interferring with existing data. One easy way to do this is to start the padawan application using the following command in the padawan root directory:

```
meteor 
```

In this case, the MongoDB URL for use in the variables.env file (described below) would be as follows:

```
DATABASE=mongodb://localhost:3001/meteor
```

##variables.env
A valid variables.env file which includes information must be provided in the root directory of this project with the following fields required. Fill in the appropriate values for your application. For security reasons, this file is not committed to source code control.

```
NODE_ENV=development (or "production" is also valid)
DATABASE=<insert valid mongoDB URL here>
APP_SECRET=appsecret123 (replace with your own value)
APP_KEY=appkey123 (replace with your own value)
FRONTEND_URL="http://localhost:7777" (this URL is sent to the enduser in an email)
MAIL_HOST="smtp.mailtrap.io" (email host for password reset)
MAIL_PORT=2525
MAIL_USER="fixme" (enter valid credential)
MAIL_PASS="fixme" (enter valid credential)
```

##Running the API in development mode

To run the application, use a version of Node.js version greater than 7.6, and start it with the following command:

```
npm run dev
```

Development mode operation provides a stack trace in the response.

##API docuemtation

Detailed API documentation can be found in the routes/index.js file.

##Automated testing

To run the automated Mocha/Chai tests use the following command:

```
npm run tests
```

Note, as mentioned above, a URL to a test database rather than a production database should be used for testing.

##Production mode

To run the API in production mode use the following command:

```
npm run prod
```

##List of TODOs

* Further test case development (search for fixme's)
* Implementation of auth microservice
* Implementation of appropriate database relationships to roles, demographics, etc.
* Consideration whether isLoggedin should support admin capabilities
* Decide whether /user/:username and /user/:username/roles should be merged into a single API
* Consider using email token login vs password login?
* In the reset method, decide whether to send the "Invalid username supplied" error message for security reasons.
* Improve password reset email
* Decide whether to leave user logged in after registration
* Is the filterd user data for roles correct?
