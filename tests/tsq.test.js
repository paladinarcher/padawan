const randomNumber = (Math.floor(Math.random() * 100000) + 1) + Date.now();

module.exports = {
    "Take the tsq": function (browser) {

        browser.url("http://localhost:3000").waitForElementVisible("body", 12000);
        createNewUser(browser);
        addPaTeam(browser);
        tsqIntroAndUserLanguageList(browser);
        tsqFamiliarUnfamiliar(browser);
        tsqConfidenceQnaire(browser);
        tsqResult(browser);
        checkCharSheet(browser);
        browser.end();
    }
}

function addPaTeam(browser) {
    browser.pause(1, function () { console.log('addPaTeam'); });
    browser.pause(1100)
    browser.pause(1, function pateam() {
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:3001/testing"
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
            if (err) throw err;
            console.log('Database connected!');

            function findNewUser() {
                client.db("testing").collection("users").findOne({ slug: `testuserfortsqnightwatchtest${randomNumber}@mydomain.com` }, function (err3, result) {
                    if (err3) throw err3;
                    // console.log('33wooo result: ', result);
                });
            }
            // client.db("testing").collection("users").update({ slug: `testuserfortsqnightwatchtest${randomNumber}@mydomain.com` }, { "roles": { "__global_roles__": ["admin"], "No Team": ["member", "admin"], "Paladin & Archer": ["member", "admin", "view-goals", "view-members", "developer", "No-Permissions"] }, "updatedAt": "2019-11-05T23:42:20.404Z", "teams": ["No Team"] }, function (err2, result) {
            client.db("testing").collection("users").updateOne({ slug: `testuserfortsqnightwatchtest${randomNumber}@mydomain.com` }, { $set: { "roles": { "No Team": ["member"], "Paladin & Archer": ["member", "No-Permissions"] }, "updatedAt": "2019-11-05T23:42:20.404Z", "teams": ["No Team"] } }, function (err2, result) {
                if (err2) throw err2;
                console.log('P&A team privileges added');
                // console.log('result: ', result);
                findNewUser();
            });
        });
    });
    browser.pause(1100)
    browser.url("http://localhost:3000").waitForElementVisible("body", 12000);
    browser.useCss();
    browser.waitForElementVisible('#nav-tsq', 15000);
}

function checkCharSheet(browser) {
    browser.pause(1, function () { console.log('checkCharSheet'); });
    browser.useCss();
    browser.url("http://localhost:3000/char_sheet").waitForElementVisible("body", 12000);
    browser.useXpath();
    browser.verify
        .visible('/html/body/div/div[2]/div/div[2]/div/div[1]') // TSQ Character Sheet panel heading
        .getText('/html/body/div/div[2]/div/div[2]/div/div[1]', function (result) {
            // console.log('result: ', result);
            if (result.value == 'Technical Skills Questionnaire - Complete') {
                console.log('true: Technical Skills Questionnaire - Complete');
            } else {
                console.log('false: Technical Skills Questionnaire - Complete');
                throw new Error('false: Technical Skills Questionnaire - Complete');
            }
        });
    // browser.pause(10000);
    browser.verify
        .visible('/html/body/div[1]/div[2]/div/div[2]/div/div[2]/div[2]/div[1]/h4') // TSQ Character Sheet Familiar Skills
        // familiar total
        .getText('/html/body/div[1]/div[2]/div/div[2]/div/div[2]/div[2]/div[1]/h4/small/span', function (result) {
            // console.log('result: ', result);
            let total = result.value.slice(7);
            if (total > 0) {
                console.log('true: Familiar Skills Total is greater then 0');
            } else {
                console.log('false: Familiar Skills Total is greater then 0');
                throw new Error('false: Familiar Skills Total is greater then 0');
            }
        });
    browser.verify
        .visible('/html/body/div[1]/div[2]/div/div[2]/div/div[2]/div[2]/div[2]/h4') // TSQ Character Sheet Unfamiliar Skills
        // unfamiliar total
        .getText('/html/body/div[1]/div[2]/div/div[2]/div/div[2]/div[2]/div[2]/h4/small/span', function (result) {
            // console.log('result: ', result);
            let total = result.value.slice(7);
            if (total > 0) {
                console.log('true: Unfamiliar Skills Total is greater then 0');
            } else {
                console.log('false: Unfamiliar Skills Total is greater then 0');
                throw new Error('false: Unfamiliar Skills Total is greater then 0');
            }
        });
    browser.useCss();
    // browser.pause(10000);
}

function createNewUser(browser) {
    browser.pause(1, function () { console.log('createNewUser'); });
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
    browser.pause(100, function () { console.log('tsqIntroAndUserLanguageList'); });
    browser.url("http://localhost:3000/technicalSkillsQuestionaire/userLanguageList?h=2").waitForElementVisible(".container", 12000);

    // for testing purposes
    browser.element("css selector", ".loading-animation", function (result) {
        // console.log('.loading-animation result: ', result);
    })

    browser.url(function (result) {
        // console.log('current url: ', result);
    })

    browser.element("css selector", ".gotohomepage", function (result) {
        // console.log('.gotohomepage result: ', result);
    })

    browser.verify.visible(".btn-continue-intro")
    browser.pause(1500)

    browser.element("css selector", ".btn-continue-intro", function (result) {
        if (result.status === 0) {
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
    browser.pause(1, function () { console.log('tsqFamiliarUnfamiliar'); });
    browser.waitForElementVisible(".unfamiliar-item-checkbox", 12000)
    browser.verify
        .visible(".unfamiliar-item-checkbox")
        // .click(".unfamiliar-item-checkbox")
        .useXpath()
        // .moveTo("/html/body/div/div[2]/div[2]/div[2]/div/div/div[2]/ul/li[1]/div/label/input", 0, 0)
        .moveToElement("/html/body/div/div[2]/div[2]/div[2]/div/div/div[2]/ul/li[1]/div/label/input", 0, 0)
        .pause(1100)
        .click("/html/body/div/div[2]/div[2]/div[2]/div/div/div[2]/ul/li[1]/div/label/input") // an unfamiliar checkbox
    browser.useCss().verify
        .visible("#continue")
        // .click("#continue")
        .useXpath()
        // .moveTo("/html/body/div/div[2]/div[3]/div[2]/button", 0, 0)
        .moveToElement("/html/body/div/div[2]/div[3]/div[2]/button", 0, 0)
        .pause(1100)
        .click("/html/body/div/div[2]/div[3]/div[2]/button") // button for next page
}

function tsqConfidenceQnaire(browser) {
    browser.pause(1, function () { console.log('tsqConfidenceQnaire'); });
    browser.pause(1100)
    browser.useCss().url(function(result) {
        browser.url(result.value).waitForElementVisible("body", 12000);
    })
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

    browser.element("css selector", "#showResults", function (result) {
        if (result.status > -1) {
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
            browser.waitForElementVisible("#showResults", 8000)
            browser.verify.visible("#showResults")
            browser.getLocationInView("#showResults").click("#showResults")
            browser.pause(2000)
        }
    })
}

function tsqResult(browser) {
    browser.pause(1, function () { console.log('tsqResult'); });
    browser.waitForElementVisible("#restart")
    browser.verify
        .visible("#restart")
}
