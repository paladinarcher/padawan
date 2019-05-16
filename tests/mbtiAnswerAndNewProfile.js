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
let firstName = "";
let lastName = "";
let bDate = "";
module.exports = {
	'Answer a question and check profile page' : function (client) {
        client
            .url('http://localhost:3000')
			.windowSize("current", "1200", "769") // setting window size for this test
            .waitForElementPresent('body', MS_WAIT)
            .assert.title('Developer Level App');
        registerSequence(client, uTest);
		client
			.useXpath()
			.waitForElementPresent('//h1[text() = "Assessments"]', MS_WAIT)
			.isVisible('//button[@class = "navbar-toggle collapsed"]', results => {
				if (results.value) {
					//Element exists, do something
					console.log("Menu button exists");
					client
						.moveToElement('//button[@class = "navbar-toggle collapsed"]', 5, 5)
						.mouseButtonClick(0);
				}
				else{
					//Element does not exist, do something else
					console.log("Menu button does not exist");
				}

			})
			.waitForElementPresent('//a[@id = "nav-traitSpectrum"]', MS_WAIT)
			.moveToElement('//a[@id = "nav-traitSpectrum"]', 2, 2)
			.mouseButtonClick(0)
			.pause(PAUSE_TIME)
			.waitForElementPresent('//div[@class = "noUi-origin"]', MS_WAIT)
			.moveToElement('//div[@class = "noUi-origin"]', 40, 3)
			.mouseButtonClick(0)
			.pause(PAUSE_TIME);
		client.expect.element('(//button[@class = "btn btn-large btn-success answer-button"])[1]').to.have.css('visibility').which.equals('visible').before(MS_WAIT);
		client
			.moveToElement('//button[@class = "btn btn-large btn-success answer-button"]', 0, 6)
			.mouseButtonClick(0)
			.pause(PAUSE_TIME)
			.pause(1000);
		client.expect.element('(//button[@class = "btn btn-large btn-success answer-button"])[1]').to.have.css('visibility').which.equals('hidden').before(MS_WAIT);
		client
			.waitForElementPresent('//a[@id = "last-dropdown"]', MS_WAIT)
			.click('//a[@id = "last-dropdown"]')
			.pause(PAUSE_TIME)
			.waitForElementPresent('//a[@id = "nav-profile"]', MS_WAIT)
			.click('//a[@id = "nav-profile"]')
			.pause(PAUSE_TIME);
	// },

	// 'Check the profile page' : function (client) {

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
			.waitForElementPresent('//input[@id = "seNotifications"]', MS_WAIT)
			.moveToElement('//input[@id = "seNotifications"]', 0, 0);
			// .saveScreenshot('./reports/test-result.png');
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
		client.expect.element('//input[@id = "seNotifications"]').to.be.selected;
		client
			.click('//input[@id = "seNotifications"]')
			.waitForElementPresent('//div[@class = "alert alert-success alert-margin"]', MS_WAIT)
			.pause(5000)
			// .saveScreenshot('./reports/test-result3.png')
			.pause(PAUSE_TIME);		
		client.useCss();
		client.expect.element('#seNotifications').to.not.be.selected;
		client.useXpath();
		client.expect.element('//div[@id = "emailNotifyAlert"]/div[@class = "alert alert-success alert-margin"]/strong').text.to.equal('Changed!');
		client
			.pause(100)
			.click('//input[@id = "seNotifications"]')
			.waitForElementPresent('//div[@id = "emailNotifyAlert"]//div[@class = "alert alert-success alert-margin"]', MS_WAIT)
			.pause(PAUSE_TIME)
			.refresh()
			.waitForElementPresent('//input[@id = "input-fname"]', MS_WAIT);
		client.expect.element('//input[@id = "input-fname"]').to.have.value.that.equals('fnTest');
		client.waitForElementPresent('//input[@id = "input-lname"]', MS_WAIT);
		client.expect.element('//input[@id = "input-lname"]').to.have.value.that.equals('lnTest');
		client.waitForElementPresent('//input[@id = "input-bdate"]', MS_WAIT);
		client.expect.element('//input[@id = "input-bdate"]').to.have.value.that.equals('2019-01-01');
		client.waitForElementPresent('//input[@id = "seNotifications"]', MS_WAIT);
		client.waitForElementPresent('//input[@id = "seNotifications"]', MS_WAIT);
		client.waitForElementPresent('//input[@id = "seNotifications"]', MS_WAIT);
		client.expect.element('//input[@id = "seNotifications"]').to.be.selected;

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
        .waitForElementPresent('#at-field-email', MS_WAIT, () => {
			console.log("registerSequence");
		})
        .click("#at-signUp")
        .setValue('#at-field-email', userObj.email)
        .setValue('#at-field-password', userObj.password)
        .setValue('#at-field-password_again', userObj.password)
        .setValue('#at-field-first_name', userObj.fname)
        .setValue('#at-field-last_name', userObj.lname)
        .pause(1000)
        .click('#at-btn');
}

