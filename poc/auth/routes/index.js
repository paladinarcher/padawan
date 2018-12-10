const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

/**
* @api {get} /api/v1/ General API information
* @apiVersion 1.0.0
* @apiName /
* @apiGroup General API information
* @apiPermission unauthorized user
*
* @apiExample {command line} Example usage:
* curl --header "Content-Type: application/json" \
* --request GET \
* http://localhost:8888/api/v1/register
*
* @apiSuccess (OK 200) {String} message: Success
*
* @apiSuccessExample {json} Success response:
*	HTTPS 200 OK
*	Content-Type: application/json; charset=utf-8
*	{"status":200,"message":"Success","data":{"name":"Developer Level API","version":"1.0.0.0","now":"December 9th 2018, 5:45:48 pm"}}
*/
router.get('/',	catchErrors(indexController.index));

/**
* @api {post} /api/v1/register User registration
* @apiVersion 1.0.0
* @apiName register
* @apiGroup authentication
* @apiPermission unauthorized user
*
* @apiParam (Request body) {String} email User email address
* @apiParam (Request body) {String} firstName User first name
* @apiParam (Request body) {String} lastName User last name
* @apiParam (Request body) {String} username User's username
* @apiParam (Request body) {String} password User password
* @deprecated @apiParam (Request body) {String} roles User roles [member|admin|manage_users]
* @deprecated @apiParam (Request body) {String} demographics {js} name, gender
*
* @apiExample {command line} Example usage:
* curl --header "Content-Type: application/json" --request POST \
* --data '{"email": "johndoe@gmail.com", "username": "john", \
* "firstName": "John", "lastName": "Doe", "password":"foobar", \
* "password_confirm":"foobar", "roles":["member"], \
* "demographics":{"name":"John Doe", "gender":"male"}}' \
* http://localhost:8888/api/v1/register
*
* @apiSuccess (Created 201) {String} message: Success
* @apiFailure: (Unprocessable Entity 422) {String} message: Registration validation error, {String array} errors: []
* @apiFailure: (Internal Server Error 500) {String} message: Database error
*
* @apiSuccessExample {json} Success response:
*	HTTPS 201 Created
*	Content-Type: application/json; charset=utf-8
*	{"status":201,"message":"Success"}
*/
router.post('/register', 
	catchErrors(authController.validateRegistration),
	catchErrors(authController.register));

/**
* @api {post} /api/v1/login User login
* @apiVersion 1.0.0
* @apiName login
* @apiGroup authentication
* @apiPermission unauthorized user
*
* Notes: When successful, a signed token for the login session is returned 
* as both a cookie and a data payload to the response. See the 
* apiSuccessExample below. The token in the response is identical in both 
* cases (cookie or data payload).
*
* For subsequent auththenticated API access, the token must be provided as part 
* of the response cookie or in the request JSON body using the "token" property.
*
* @apiParam (Request body) {String} username User's username
* @apiParam (Request body) {String} password User password
*
* @apiExample {command line} Example usage:
* curl --header "Content-Type: application/json" --request POST \
* --cookie-jar ~/mycookie --data '{"username": "john", \
* "password": "foobar"}' \
* http://localhost:8888/api/v1/login
*
* @apiSuccess (OK 200) {String} message: Success, {String}data: token
* @apiFailure (Bad Request 400) {String} message: Invalid login credentials
* @apiFailure: (Unprocessable Entity 422) {String} message: Registration validation error, {String array} errors: []
* @apiFailure: (Internal Server Error 500) {String} message: Database error
*
* @apiSuccessExample {json} Success response:
*	HTTPS 200 OK
*	Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzBkYWRjZjEzZTc4MTY4YzQ3YzVhNGMiLCJ0b2tlblRpbWVvdXQiOjE1NzU5MzcyNjIyMDUsImlhdCI6MTU0NDQwMTI2Mn0.JCSDYfMNRycr-sdAvRnrUz8dDbfqy-8WGwBB0eZq4mM; Max-Age=31536000; Path=/; Expires=Tue, 10 Dec 2019 00:21:02 GMT
*	Content-Type: application/json; charset=utf-8
*	{"status":200,"message":"Success","data":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzBkYWRjZjEzZTc4MTY4YzQ3YzVhNGMiLCJ0b2tlblRpbWVvdXQiOjE1NzU5MzcyNjIyMDUsImlhdCI6MTU0NDQwMTI2Mn0.JCSDYfMNRycr-sdAvRnrUz8dDbfqy-8WGwBB0eZq4mM"}
*/
router.post('/login', 
	catchErrors(authController.validateLogin),
	catchErrors(authController.login)); 

/**
* @api {delete} /api/v1/logout User logout
* @apiVersion 1.0.0
* @apiName logout
* @apiGroup authentication
* @apiPermission unauthorized user
*
* Notes: This operation will clear the token from the response cookie. Any 
* prior stored payload token stored by the client must be cleared by the 
* client.
*
* @apiExample {command line} Example usage:
* curl --header "Content-Type: application/json" --request DELETE \
* --cookie ~/mycookie \
* http://localhost:8888/api/v1/logout
*
* @apiSuccess (OK 200) {String} message: Success
* 
* @apiSuccessExample {json} Success response:
*	HTTPS 200 OK
*	Set-Cookie: token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
*	Content-Type: application/json; charset=utf-8
*	{"status":200,"message":"Success"}
*/
router.delete('/logout', catchErrors(authController.logout));

/**
* @api {post} /api/v1/requestreset User password reset request
* @apiVersion 1.0.0
* @apiName requestreset
* @apiGroup authentication
* @apiPermission unauthorized user
*
* @apiParam (Request body) {String} username User's username
*
* @apiExample {command line} Example usage:
* curl --header "Content-Type: application/json" --request POST \
* --data '{"username": "john"}' \
* http://localhost:8888/api/v1/requestreset
*
* @apiSuccess (OK 200) {String} message: Success, {String} data: resetToken
* @apiFailure: (Bad Request 400) {String} message: Invalid username supplied
* @apiFailure: (Unprocessable Entity 422) {String} message: Registration validation error, {String array} errors: []
* @apiFailure: (Internal Server Error 500) {String} message: Database error
* @apiFailure: (Not Implemented 501) {String} message: Error while sending reset email, {String} data: resetToken
*
* @apiSuccessExample {json} Success response:
*	HTTPS 200 OK
*	Content-Type: application/json; charset=utf-8
*	{"status":200,"message":"Success","data":{"resetToken":"dfbe5c17a1905116271848292ee38289a14e0cf8"}}
*/
router.post('/requestreset', 
	catchErrors(authController.requestResetValidation),
	catchErrors(authController.requestReset));
	
/**
* @api {post} /api/v1/reset User password reset
* @apiVersion 1.0.0
* @apiName reset
* @apiGroup authentication
* @apiPermission unauthorized user
*
* @apiParam (Request body) {String} username User's username
* @queryParam {String} resetToken reset token value returned by resetrequest
*
* @apiExample {command line} Example usage:
* curl --header "Content-Type: application/json" --request POST \
* --data '{"password":"anewpassword", "password_confirm":"anewpassword"}' \
* http://localhost:8888/api/v1/reset?resetToken=2a767a7321e4256fb26ee964f917749ba845df42
*
* @apiSuccess (OK 200) {String} message: Success, {String} data: resetToken
* @apiFailure: (Bad Request 400) {String} message: Invalid password reset token
* @apiFailure: (Unprocessable Entity 422) {String} message: Password validation error, {String array} errors: []
* @apiFailure: (Internal Server Error 500) {String} message: Database error
*
* @apiSuccessExample {json} Success response:
*	HTTPS 200 OK
*	Content-Type: application/json; charset=utf-8\
*	{"status":200,"message":"Success"}
*/
router.post('/reset', catchErrors(authController.reset));

/**
* @api {post} /api/v1/isLoggedIn Determine whether user is logged in
* @apiVersion 1.0.0
* @apiName isLoggedIn
* @apiGroup authentication
* @apiPermission authorized user
* 
* Notes: For the API to succeed, a valid token must be provided by either
* cookie or token in the body of the request. The apiExample provided assumes
* usage of a cookie.
*
* @apiExample {command line} Example usage:
* curl --header "Content-Type: application/json" --request POST \
* --cookie-jar ~/mycookie --data '{"username": "john", \
* "password": "foobar"}' \
* http://localhost:8888/api/v1/login
* curl --header "Content-Type: application/json" --request GET \
* --cookie ~/mycookie \
* http://localhost:8888/api/v1/isloggedin
*
* @apiSuccess (OK 200) {String} message: Success
* @apiFailure: (Not Found 404) {String} message: Page not found
*
* @apiSuccessExample {json} Success response:
*	HTTPS 200 OK
*	Content-Type: application/json; charset=utf-8\
*	{"status":200,"message":"Success"}
*/
router.get('/isloggedin', catchErrors(authController.isLoggedin)); 

/**
* @api {post} /api/v1/users Report information about all users
* @apiVersion 1.0.0
* @apiName users
* @apiGroup users
* @apiPermission authorized user with admin or manage_users permissions
* 
* Notes: User making the request must be have proper permissions, otherwise a
* 404 Not found error response will be issued.
*
* @apiExample {command line} Example usage:
* curl --header "Content-Type: application/json" --request POST \
* --cookie-jar ~/mycookie --data '{"username": "john", \
* "password": "foobar"}' \
* http://localhost:8888/api/v1/login
* curl --header "Content-Type: application/json" --request GET \
* --cookie ~/mycookie \
* http://localhost:8888/api/v1/users
*
* @apiSuccess (OK 200) {String} message: Success
* @apiFailure: (Not Found 404) {String} message: Page not found
*
* @apiSuccessExample {json} Success response:
*	HTTPS 200 OK
*	Content-Type: application/json; charset=utf-8\
* 	{"status":200,"message":"Success","data":[{"name":"Jane Doe","gender":"female","email":"janedoe@gmail.com"},{"name":"John Doe","gender":"male","email":"johndoe@gmail.com"}]}
*/
router.get('/users', catchErrors(userController.users));

router.get('/user/:username', catchErrors(userController.getUserByUsername));
router.get('/user/:username/roles', catchErrors(userController.getUserRoles));

module.exports = router;