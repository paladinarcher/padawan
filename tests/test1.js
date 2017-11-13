let MS_WAIT = 10000;
module.exports = {
    'Demo test Google' : function (client) {
        client
            .url('http://localhost:3000')
            .waitForElementPresent('body', MS_WAIT)
            .assert.title('Progressive Web Application')
            .waitForElementPresent('#at-field-email', MS_WAIT)
            .setValue('#at-field-email', 'admin@mydomain.com')
            .waitForElementPresent('#at-field-password', MS_WAIT)
            .setValue('#at-field-password', 'admin')
            .pause(1000)
            .waitForElementPresent('button#at-btn', MS_WAIT)
            .click('button#at-btn')
            .waitForElementPresent('#nav-teams', MS_WAIT)
            .assert.containsText("#nav-teams", "Teams")
            .click("#nav-teams")
            .waitForElementPresent("[data-team-name]:first-of-type", MS_WAIT)
            .assert.attributeContains("[data-team-name]:first-of-type", "data-team-name", "No Team")
            .end()
    }
}
