This application contains an authentication prototype which provides basic
authentication backend functionality according to the following specification:

/*
 * It doesn't work with the existing padawan application. It must perform the
 * following:
 *
 * - receive authentication information and respond properly (including 
 * returning success/failure/whatever else needs returning)
 * 
 * - receive some sort of user identifier and return whether that user 
 *   is logged in
 * 
 * - receive some sort of user identifier and return basic demographic 
 *   info
 * 
 * - receive some sort of user identifier and return global user roles 
 *  (admin, etc; Team roles are not necessary)
 * 
 */

This backend does require a variables.env file which includes valid values
for the following variables:

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

This application currently only supports a single User table in the MongoDB 
and it uses its own DB schema for the User collection. Other collection 
relationships in the DB (such as user roles, demographics, etc) are not yet
supported.

A simple way to get a database running is to start the padawan app as normal,
and supply the MongoDB URL. By default this is one more than the application 
port. For example, by default the Meteor app for Padawan starts on port
3000, and in this case the MongoDB URL for the variables.env would be as 
follows:

```
DATABASE=mongodb://localhost:3001/meteor
```

Usage of the mongodb-compass application is useful to manually delete and
update values in the database.