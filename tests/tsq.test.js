const randomNumber = (Math.floor(Math.random() * 100000) + 1) + Date.now();

module.exports = {
    "Take the tsq": function(browser) {
        browser.url("http://localhost:3000").waitForElementVisible("body", 12000);

        createNewUser(browser);
        tsqIntroAndUserLanguageList(browser);
        tsqFamiliarUnfamiliar(browser);
        tsqConfidenceQnaire(browser);
        tsqResult(browser);
        browser.end();
    }
}

function createNewUser(browser) {
    browser.verify
        .visible("#at-signUp")
        .click("#at-signUp")
    browser
        .waitForElementVisible("#at-field-email", 12000)
        .setValue("#at-field-email", `testUserForTsqNightwatchTest${randomNumber}@mydomain.com`)
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
    browser.url("http://localhost:3000/technicalSkillsQuestionaire/userLanguageList?h=2").waitForElementVisible(".panel-heading", 12000);
    browser.verify.visible(".btn-continue-intro")
    browser.pause(1500)

    browser.element("css selector", ".btn-continue-intro", function(result) {
        if(result.status === 0){
            console.log('Intro page is visible! ', result);
            browser.verify
                .visible(".btn-continue-intro")
                .click(".btn-continue-intro")
            browser.waitForElementVisible(".btn-continue-intro", 12000)
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
        } else {
            console.log('Intro page is NOT visible! ', result);

            browser.url(function(result){
                console.log('current url: ', result);
            })

            browser.element("css selector", ".gotohomepage", function(result) {
                console.log('.gotohomepage result: ', result);
            })

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
    })
}

function tsqFamiliarUnfamiliar(browser) {
    browser.waitForElementVisible(".unfamiliar-item-checkbox", 12000)
    browser.verify
        .visible(".unfamiliar-item-checkbox")
        .click(".unfamiliar-item-checkbox")
    browser.verify
        .visible("#continue")
        .click("#continue")
}

function tsqConfidenceQnaire(browser) {
    browser.useXpath().waitForElementVisible("//*[@id='confidence_list'][10]/div/button[1]", 12000)
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
    
    browser.element("css selector", "#showResults", function(result) {
        if(result.status > -1) {
            browser.getLocationInView("#showResults").click("#showResults")
        } else {
            browser.verify.visible(".nextLanguage")
            browser.getLocationInView(".nextLanguage").click(".nextLanguage")
            browser.pause(2000)
            browser.waitForElementVisible("div[class=panel-body]", 12000)
            browser.useXpath()
            browser.verify.visible("//*[@id='confidence_list']/div/button[3]")
            browser.getLocationInView("//*[@id='confidence_list']/div/button[3]").click("//*[@id='confidence_list']/div/button[3]")
            browser.useCss()
            browser.waitForElementVisible("#showResults", 1000)
            browser.verify.visible("#showResults")
            browser.getLocationInView("#showResults").click("#showResults")
            browser.pause(2000)
        }
    })
}

function tsqResult(browser) {
    browser.waitForElementVisible("#restart")
    browser.verify
        .visible("#restart")
}
