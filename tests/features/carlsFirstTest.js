let MS_WAIT = 15000;
let PAUSE_TIME = 1000;
let uAdmin = {
    email: 'admin@mydomain.com',
    password: 'admin'
};
let uTest = {
    email: 'john@doe' + (Math.floor(Math.random() * 100000) + 1) + "DATE" + new Date().valueOf() + '.com',
    password: 'johndoe',
    fname: 'John',
    lname: 'Doe'
}
let tTest = {
    name: "NW Test Team" + new Date().valueOf()
}
let gTest = {
    title: "NW Test Goal " + new Date().valueOf(),
    description: "This is a description set by Nightwatch automated testing"
}
let qnCoord = {
	x: "0",
	y: "0"
}
module.exports = {
	'Answer a question' : function (client) {
        client
            .url('http://localhost:3000')
            .waitForElementPresent('body', MS_WAIT)
            .assert.title('Developer Level App');

        //loginSequence(client, uAdmin);
        registerSequence(client, uTest);

		client
			//.waitForElementPresent('#nav-answerquestions', MS_WAIT)
			//.click('#nav-answerquestions')
			.useXpath()
			.waitForElementPresent('//a[@id = "nav-answerquestions"]', MS_WAIT)
			.click('//a[@id = "nav-answerquestions"]')
			.pause(PAUSE_TIME)
			.waitForElementPresent('//div[@class = "slider noUi-target noUi-ltr noUi-horizontal noUi-background"]', MS_WAIT)
			.pause(PAUSE_TIME)
			.getLocationInView('//div[@class = "slider noUi-target noUi-ltr noUi-horizontal noUi-background"]', function (result) {
				console.log("x: " + result.value.x + " y: " + result.value.y);
			})
			.moveToElement('//div[@class = "slider noUi-target noUi-ltr noUi-horizontal noUi-background"]', -500, 0)
			.mouseButtonClick(0)

			.pause(PAUSE_TIME)

//			.moveToElement('//div[@class = "noUi-handle noUi-handle-lower"]', 100, 0)
//			.pause(PAUSE_TIME)
//			.mouseButtonClick(0)
//			.moveToElement('//div[@class = "slider noUi-target noUi-ltr noUi-horizontal noUi-background"]', -100, -45)
//			.mouseButtonClick(0)
//			.pause(PAUSE_TIME)
//			.moveToElement('//div[@class = "slider noUi-target noUi-ltr noUi-horizontal noUi-background"]', -100, -40)
//			.mouseButtonClick(0)
//			.pause(PAUSE_TIME)
//			.moveToElement('//div[@class = "slider noUi-target noUi-ltr noUi-horizontal noUi-background"]', -100, -35)
//			.mouseButtonClick(0)
//			.pause(PAUSE_TIME)
//			.moveToElement('//div[@class = "slider noUi-target noUi-ltr noUi-horizontal noUi-background"]', -100, -30)
//			.mouseButtonClick(0)
//			.pause(PAUSE_TIME)
//			.moveToElement('//div[@class = "slider noUi-target noUi-ltr noUi-horizontal noUi-background"]', -100, -25)
//			.mouseButtonClick(0)
//			.pause(PAUSE_TIME)
//			.moveToElement('//div[@class = "slider noUi-target noUi-ltr noUi-horizontal noUi-background"]', -100, -20)
//			.mouseButtonClick(0)
//			.pause(PAUSE_TIME)
//			.moveToElement('//div[@class = "slider noUi-target noUi-ltr noUi-horizontal noUi-background"]', -100, -15)
//			.mouseButtonClick(0)
//			.pause(PAUSE_TIME)
//			.moveToElement('//div[@class = "slider noUi-target noUi-ltr noUi-horizontal noUi-background"]', -100, -10)
//			.mouseButtonClick(0)
//			.pause(PAUSE_TIME)
//			.moveToElement('//div[@class = "slider noUi-target noUi-ltr noUi-horizontal noUi-background"]', -100, -5,)
//			.mouseButtonClick(0)
//			.pause(PAUSE_TIME)

			//.mouseButtonDown(0)
			//.mouseButtonUp(0)
			//.click('//div[@class = "slider noUi-target noUi-ltr noUi-horizontal noUi-background"]')
			//.waitForElementPresent('//div[@class = "slider"], MS_WAIT)
			//.click('(//div[@class = "slider"])')
//<div class="slider noUi-target noUi-ltr noUi-horizontal noUi-background" data-value="0" style="z-index: 10;"><div class="noUi-base"><div class="noUi-origin" style="left: 15%;"><div class="noUi-handle noUi-handle-lower"></div></div></div></div> //copy the whole class and see if it works
			.pause(PAUSE_TIME)
			.useCss();
//		for (int i = 0; i < 10; i++) {
//			console.log("hello for " + i);
////			client
////				.waitForElementPresent('//div[@class = "slider noUi-target noUi-ltr noUi-horizontal noUi-background"]', MS_WAIT)
////				.moveToElement('//div[@class = "slider noUi-target noUi-ltr noUi-horizontal noUi-background"]', -100, 0 + (5 * i), function (result) {
////					console.log("hello moveToElement " + qnCoord.x);
////				})
////				.pause(PAUSE_TIME)
//			
//		}
		client.end();
	},

//    'Demo test Padawan' : function (client) {
//        client
//            .url('http://localhost:3000')
//            .waitForElementPresent('body', MS_WAIT)
//            .assert.title('Developer Level App');
//
//        loginSequence(client, uAdmin);
//
//        createTeamSequence(client, tTest.name);
//
//        logoutSequence(client);
//
//        registerSequence(client, uTest);
//		client.end();
//        /*
//		
//
//        client
//            .waitForElementPresent('#nav-teams', MS_WAIT)
//            .click("#nav-teams")
//            .pause(1000)
//            .click("#nav-teams")
//            .waitForElementPresent('.btn-user-request-join', MS_WAIT)
//            .click('.btn-user-request-join');
//
//        logoutSequence(client);
//
//        loginSequence(client, uAdmin);
//        */
//
//        /*
//        client
//            .waitForElementPresent('#nav-teams', MS_WAIT)
//            .click("#nav-teams")
//            .waitForElementPresent('.btn-approve-join', MS_WAIT)
//            .click(".btn-approve-join")
//            .waitForElementPresent('[data-team-name="'+tTest.name+'"] .selectized', MS_WAIT)
//            //first user added gets admin role
//            .assert.containsText('[data-team-name="'+tTest.name+'"] .selectize-input.items', "admin")
//            .click('[data-team-name="'+tTest.name+'"] .team-goal-quick-list')
//            .waitForElementPresent('#btn-add-goal', MS_WAIT)
//            .click('#btn-add-goal')
//            .setValue("#goal-title-new", gTest.title)
//            .setValue("#goal-description-new", gTest.description)
//            .setValue("#div-goal-new .selectize-input input", uTest.fname)
//            .keys(client.Keys.ENTER)
//            .assert.containsText('#div-goal-new .selectize-input.items', uTest.fname + " " + uTest.lname)
//            .click('#div-goal-new .btn-save')
//            .pause(1000)
//            .assert.containsText('.row.spaced.existing-goals .team-goal-title', gTest.title)
//            .pause(5000)
//            .end()
//            */
//    }
}

function loginSequence(client, user) {
    if (typeof user !== 'object') {
        user = {email: user, password: password};
    }
    return client
        .waitForElementPresent('body', MS_WAIT)
        .waitForElementPresent('#at-field-email', MS_WAIT)
        .setValue('#at-field-email', user.email)
        .waitForElementPresent('#at-field-password', MS_WAIT)
        .setValue('#at-field-password', user.password)
        .pause(1000)
        .waitForElementPresent('button#at-btn', MS_WAIT)
        .click('button#at-btn');
}

function logoutSequence(client) {
    return client
        .waitForElementPresent('#last-dropdown', MS_WAIT)
        .click("#last-dropdown")
        .waitForElementPresent('#at-nav-button', MS_WAIT)
        .click("#at-nav-button");
}

function createTeamSequence(client, teamName) {
    return client
        .waitForElementPresent('#nav-teams', MS_WAIT)
        .click('#nav-teams')
        .waitForElementPresent('#input-new-team-name', MS_WAIT)
        .setValue('#input-new-team-name', teamName)
        .click('#btn-create-team')
        .assert.containsText("#msg-create", "Team created");
}

function registerSequence(client, userObj) {
    return client
        .waitForElementPresent('#at-field-email', MS_WAIT)
        .click("#at-signUp")
        .setValue('#at-field-email', userObj.email)
        .setValue('#at-field-password', userObj.password)
        .setValue('#at-field-password_again', userObj.password)
        .setValue('#at-field-first_name', userObj.fname)
        .setValue('#at-field-last_name', userObj.lname)
        .pause(1000)
        .click('#at-btn');
}

