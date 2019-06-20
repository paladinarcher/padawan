

// *****
//
// THIS TEST IS DISABLED BECAUSE IT WAS WRITTEN FOR THE OLD MBTI FRAMEWORK WHICH IS NO LONGER BEING USED
// ONLY LEAVING FOR REFERENCE FOR NIGHTWATCH TESTS
//
// *****


let MS_WAIT = 15000;
let PAUSE_TIME = 0.0000001;
//let PAUSE_TIME = 1000;
let uAdmin = {
    email: 'admin@mydomain.com',
    password: 'admin'
};
let uTest = {
    email: 'john@doe' + (Math.floor(Math.random() * 100000) + 1) + "DATE" + new Date().valueOf() + '.com',
    password: 'johndoe',
    fname: 'John',
	lname: 'Doe',
	passcode: 'qwepofijPADLf23ef2o3ij'
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
let firstName = "";
let lastName = "";
let bDate = "";
module.exports = {
	'@disabled': true, // DISABLED HERE ******
	'Answer a question' : function (client) {
        client
            .url('http://localhost:3000')
            .waitForElementPresent('body', MS_WAIT)
            .assert.title('Developer Level App');
        registerSequence(client, uTest);
		client
			.useXpath()
			.waitForElementPresent('//a[@id = "nav-traitSpectrum"]', MS_WAIT)
			.click('//a[@id = "nav-traitSpectrum"]')
			.pause(PAUSE_TIME)
			.waitForElementPresent('//div[@class = "noUi-handle noUi-handle-lower"]', MS_WAIT)
			.getLocationInView('//div[@class = "slider noUi-target noUi-ltr noUi-horizontal noUi-background"]', function (result) {
				console.log("x: " + result.value.x + " y: " + result.value.y);
			})
			.getLocationInView('//div[@class = "noUi-handle noUi-handle-lower"]', function (result) {
				console.log("x: " + result.value.x + " y: " + result.value.y);
			})
			.moveToElement('//div[@class = "noUi-handle noUi-handle-lower"]', -100, 6)
			.mouseButtonClick(0)
			.pause(PAUSE_TIME);
		//client.assert.cssProperty('//button[@class = "btn btn-large btn-success answer-button"]', 'visibility', 'visible', 'clicked on mbti answer');
		client.expect.element('//button[@class = "btn btn-large btn-success answer-button"]').to.have.css('visibility').which.equals('visible').before(MS_WAIT);
		client
			.moveToElement('//button[@class = "btn btn-large btn-success answer-button"]', 0, 6)
			.mouseButtonClick(0)
			.pause(PAUSE_TIME)
			.pause(1000);
		client.expect.element('//button[@class = "btn btn-large btn-success answer-button"]').to.have.css('visibility').which.equals('hidden').before(MS_WAIT);
		client
			.waitForElementPresent('//a[@id = "last-dropdown"]', MS_WAIT)
			.click('//a[@id = "last-dropdown"]')
			.pause(PAUSE_TIME)
			.waitForElementPresent('//a[@id = "nav-profile"]', MS_WAIT)
			.click('//a[@id = "nav-profile"]')
			.pause(PAUSE_TIME);
	},

	'Check the profile page' : function (client) {

		client
			.waitForElementPresent('//input[@id = "input-fname"]', MS_WAIT)
			.clearValue('//input[@id = "input-fname"]')
			.click('//input[@id = "input-fname"]')
			.setValue('//input[@id = "input-fname"]', 'fnTest')
			.pause(PAUSE_TIME)

			.waitForElementPresent('//input[@id = "input-lname"]', MS_WAIT)
			.clearValue('//input[@id = "input-lname"]')
			.click('//input[@id = "input-lname"]')
			.setValue('//input[@id = "input-lname"]', 'lnTest')
			.pause(PAUSE_TIME)
			.waitForElementPresent('//input[@id = "seNotifications"]', MS_WAIT);
		client.expect.element('//input[@id = "seNotifications"]').to.be.selected;
		client
			.waitForElementPresent('//input[@id = "input-email"]', MS_WAIT)
			.clearValue('//input[@id = "input-email"]')
			.click('//input[@id = "input-email"]')
			.setValue('//input[@id = "input-email"]', 'emailTest')
			.pause(PAUSE_TIME);
		client.expect.element('//input[@id = "input-email"]/../..//p[@class = "left"]').text.to.equal('Not Verified');	
		client
			.waitForElementPresent('//button[@id = "verifyButton"]', MS_WAIT)
			.click('//button[@id = "verifyButton"]')
			.pause(1000)
			.waitForElementNotPresent('//div[@id = "emailAlert"]/div[@class = "alert alert-warning alert-margin"]')
			.pause(PAUSE_TIME)

			.waitForElementPresent('//input[@id = "input-bdate"]', MS_WAIT)
			.clearValue('//input[@id = "input-bdate"]')
			.click('//input[@id = "input-bdate"]')
			.setValue('//input[@id = "input-bdate"]', '2019-01-01\n')
			.pause(PAUSE_TIME)

			.waitForElementPresent('//button[@class = "btn btn-success btn-save glyphicon glyphicon-ok details"]', MS_WAIT)
			.click('//button[@class = "btn btn-success btn-save glyphicon glyphicon-ok details"]')
			.waitForElementPresent('//input[@id = "seNotifications"]', MS_WAIT);
		client.expect.element('//input[@id = "seNotifications"]').to.be.not.selected;
		client
			.click('//input[@id = "seNotifications"]')
			.waitForElementPresent('//div[@class = "alert alert-success alert-margin"]', MS_WAIT)
			.pause(PAUSE_TIME);		
		client.expect.element('//div[@id = "emailNotifyAlert"]/div[@class = "alert alert-success alert-margin"]/strong').text.to.equal('Changed!');
		client
			.pause(100)
			.click('//input[@id = "seNotifications"]')
			.waitForElementPresent('//div[@id = "emailNotifyAlert"]//div[@class = "alert alert-success alert-margin"]', MS_WAIT)
			.pause(PAUSE_TIME)
			.refresh()
			.pause(3000)
			.waitForElementPresent('//input[@id = "input-fname"]', MS_WAIT);
		client.expect.element('//input[@id = "input-fname"]').to.have.value.that.equals('fnTest');
		client.waitForElementPresent('//input[@id = "input-lname"]', MS_WAIT);
		client.expect.element('//input[@id = "input-lname"]').to.have.value.that.equals('lnTest');
		client.waitForElementPresent('//input[@id = "input-bdate"]', MS_WAIT);
		client.expect.element('//input[@id = "input-bdate"]').to.have.value.that.equals('2019-01-01');
		client.waitForElementPresent('//input[@id = "seNotifications"]', MS_WAIT);
		client.expect.element('//input[@id = "seNotifications"]').to.be.not.selected;

		client
			.pause(PAUSE_TIME)
			.useCss()
			.end();
	}

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
        .setValue('#at-field-access_code', userObj.passcode)
        .pause(1000)
        .click('#at-btn');
}

