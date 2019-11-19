// const User = require("../imports/api/users/users");

module.exports = {
    "Take the tsq": function(browser) {
        browser.url("http://localhost:3000").waitForElementVisible("body", 12000);

        // adminLogin(browser);
        createNewUser(browser);
        // removeUser();
        tsqIntroAndUserLanguageList(browser);
        tsqFamiliarUnfamiliar(browser);
        tsqConfidenceQnaire(browser);
        tsqResult(browser);
        browser.end();
    }
}

// function adminLogin(browser) {
//     browser.verify
//         .visible("#at-field-email")
//         .setValue("#at-field-email", "admin@mydomain.com");
//     browser.verify
//         .visible("#at-field-password")
//         .setValue("#at-field-password", "admin");
//     browser.verify
//         .visible("#at-btn")
//         .click("#at-btn");
//   }

function createNewUser(browser) {
    browser.verify
        .visible("#at-signUp")
        .click("#at-signUp")
    browser
        .waitForElementVisible("#at-field-email", 12000)
        .setValue("#at-field-email", "testUserForTsqNightwatchTest1234@mydomain.com")
    browser.verify
        .visible("#at-field-password")
        .setValue("#at-field-password", "password")
    browser.verify
        .visible("#at-field-password_again")
        .setValue("#at-field-password_again", "password")
    browser.verify
        .visible("#at-field-first_name")
        .setValue("#at-field-first_name", "testUserForTsqNightwatchTest")
    browser.verify
        .visible("#at-field-last_name")
        .setValue("#at-field-last_name", "testing")
    browser.verify
        .visible("#at-field-access_code")
        .setValue("#at-field-access_code", "PADL")
    browser.verify
        .visible("#at-btn")
        .click("#at-btn")
    browser.pause(2000);
}

function tsqIntroAndUserLanguageList(browser) {
    browser.url("http://localhost:3000/technicalSkillsQuestionaire/userLanguageList").waitForElementVisible("body", 12000);
    browser.waitForElementVisible("div[class=panel-body]", 12000)
    browser.waitForElementVisible(".wp-image-897", 12000)
    browser.verify
        .visible(".btn-continue-intro")
        .click(".btn-continue-intro")
    browser.waitForElementVisible("div[class=panel-body]", 12000)
    browser.waitForElementVisible(".wp-image-905", 12000)
    browser.verify
        .visible(".btn-continue-intro")
        .click(".btn-continue-intro")
    browser.verify
        .visible(".selectize-input")
        .click(".selectize-input")
    browser.verify
        .visible(".selectize-dropdown-content")
    browser
        .useXpath()
        .click("//div[text()='JavaScript']")
        .useCss()
        .waitForElementVisible(".remove")
    browser
        .click(".subtitles") // clicking on subtitles to close the dropdown
    browser.verify
        .visible("#continue")
        .click("#continue")
}

function tsqFamiliarUnfamiliar(browser) {
    browser.waitForElementVisible("div[class=panel-body]", 12000)
    browser.verify
        .visible(".unfamiliar-item-checkbox")
        .click(".unfamiliar-item-checkbox")
    browser.verify
        .visible("#continue")
        .click("#continue")
}

function tsqConfidenceQnaire(browser) {
    browser.waitForElementVisible("div[class=panel-body]", 12000)
    browser
    .useXpath()
    .waitForElementVisible("//*[@id='confidence_list'][10]/div/button[1]", 45000)
    browser
        .click("//*[@id='confidence_list'][1]/div/button[1]")
        .click("//*[@id='confidence_list'][2]/div/button[2]")
        .click("//*[@id='confidence_list'][3]/div/button[3]")
        .click("//*[@id='confidence_list'][4]/div/button[4]")
        .click("//*[@id='confidence_list'][5]/div/button[5]")
        .click("//*[@id='confidence_list'][6]/div/button[6]")
        .click("//*[@id='confidence_list'][7]/div/button[1]")
        .click("//*[@id='confidence_list'][8]/div/button[2]")
        .click("//*[@id='confidence_list'][9]/div/button[3]")
        .click("//*[@id='confidence_list'][10]/div/button[4]")
        .useCss()
    browser.verify
        .visible("#showResults")
        .click("#showResults")
}

function tsqResult(browser) {
    browser.waitForElementVisible("div[class=panel-body]")
    browser.verify
        .visible("#restart")
}

// function removeUser() {
//     const test = User.findOne({ slug: "testUserForTsqNightwatchTest1234@mydomain.com"});
//     console.log("test user right here: ", test);
// }