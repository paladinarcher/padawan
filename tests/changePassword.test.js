const randomNumber = (Math.floor(Math.random() * 100000) + 1) + Date.now();

module.exports = {
    "Registering a new user and changing password": function(browser) {
        var runtimeBrowser = browser.capabilities.browserName.toUpperCase();
        if (runtimeBrowser == "CHROME") {
            console.log('CHROME');
        }
        if (runtimeBrowser == "FIREFOX") {
            console.log('FIREFOX');
        }
        browser.url("http://localhost:3000").waitForElementVisible("body", 12000);

        createNewUser(browser);
        createNewPassword(browser);
        signInWithNewPassword(browser);
        browser.end();
    }
}

function createNewUser(browser) {
    browser.verify
        .visible("#at-signUp")
        .click("#at-signUp")
    browser
        .waitForElementVisible("#at-field-email", 12000)
        .setValue("#at-field-email", `testUserForNightwatchTesting${randomNumber}@mydomain.com`)
    browser.verify
        .visible("#at-field-password")
        .setValue("#at-field-password", "password")
    browser.verify
        .visible("#at-field-password_again")
        .setValue("#at-field-password_again", "password")
    browser.verify
        .visible("#at-field-first_name")
        .setValue("#at-field-first_name", "testUserForNightwatchTesting")
    browser.verify
        .visible("#at-field-last_name")
        .setValue("#at-field-last_name", "testing")
    browser.verify
        .visible("#at-field-access_code")
        .setValue("#at-field-access_code", "PADL")
    browser.verify
        .visible("#at-btn")
        .click("#at-btn")
    browser.waitForElementVisible("#last-dropdown")
}

function createNewPassword(browser) {
    browser.verify
        .visible("#last-dropdown")
        .click("#last-dropdown")
    browser.verify
        .visible("#nav-profile")
        .click("#nav-profile")
    browser
        .waitForElementVisible("#old-password", 10000)
        .setValue("#old-password", "password")
    browser.verify
        .visible("#input-password")
        .setValue("#input-password", "newPassword")
    browser.verify
        .visible("#input-password-check")
        .setValue("#input-password-check", "newPassword")
    browser.verify
        .visible("#passwordButton")
        .click("#passwordButton")
    browser.waitForElementVisible(".alert-success")
}

function signInWithNewPassword(browser) {
    browser.verify
        .visible("#last-dropdown")
        .click("#last-dropdown")
    browser.verify
        .visible("#at-nav-button")
        .click("#at-nav-button")
    browser.verify
        .visible("#at-field-email")
        .setValue("#at-field-email", `testUserForNightwatchTesting${randomNumber}@mydomain.com`)
    browser.verify
        .visible("#at-field-password")
        .setValue("#at-field-password", "newPassword")
    browser.verify
        .visible("#at-btn")
        .click("#at-btn")
    browser.waitForElementVisible("#last-dropdown")
}
