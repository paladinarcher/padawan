const randomNumber = (Math.floor(Math.random() * 100000) + 1) + Date.now();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:3001/testing"

module.exports = {
    "Take the tsq": function (browser) {

        var runtimeBrowser = browser.capabilities.browserName.toUpperCase();
        if (runtimeBrowser == "CHROME") {
            console.log('CHROME');
        }
        if (runtimeBrowser == "FIREFOX") {
            console.log('FIREFOX');
        }

        // browser.windowSize("current", "1200", "769"); // setting window size for this test
        browser.windowSize("current", "1200", "1800"); // setting window size for this test
        browser.url("http://localhost:3000/signin").waitForElementVisible("body", 12000);
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

function testConList(i, myXpath, myBrowser, optionFunc) {
    console.log(myXpath + ' i: ', i);
    myBrowser.useXpath().pause(300, function () {
        myBrowser.element("xpath", myXpath, function (result) {
            if (result.status > -1) {
                console.log('element is present');
            } else if (i <= 0) {
                console.log('ran out of tries');
            } else {
                // console.log('-1 or less');
                if (i % 20 == 0) {
                    if (optionFunc) {
                        optionFunc(i - 1, myXpath, myBrowser, optionFunc);
                    }
                    myBrowser.refresh(function () {
                        testConListHelper(i - 1, myXpath, myBrowser, optionFunc);
                    });
                } else {
                    myBrowser.perform(function () {
                        setTimeout(function () {
                            testConListHelper(i - 1, myXpath, myBrowser, optionFunc);
                        }, 0);
                    });
                }
            }
        });
    });
}
function testConListHelper(i, myXpath, myBrowser, optionFunc) {
    setTimeout(function () {
        testConList(i, myXpath, myBrowser, optionFunc);
    }, 1);
}

function pateam() {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        if (err) throw err;
        console.log('Database connected!');

        function findNewUser() {
            client.db("testing").collection("users").findOne({ slug: `testuserfortsqnightwatchtest${randomNumber}@mydomain.com` }, function (err3, result) {
                if (err3) throw err3;
                // console.log('new user result: ', result);
            });
        }
        // client.db("testing").collection("users").update({ slug: `testuserfortsqnightwatchtest${randomNumber}@mydomain.com` }, { "roles": { "__global_roles__": ["admin"], "No Team": ["member", "admin"], "Paladin & Archer": ["member", "admin", "view-goals", "view-members", "developer", "No-Permissions"] }, "updatedAt": "2019-11-05T23:42:20.404Z", "teams": ["No Team"] }, function (err2, result) {
        client.db("testing").collection("users").updateOne({ slug: `testuserfortsqnightwatchtest${randomNumber}@mydomain.com` }, { $set: { "roles": { "No Team": ["member"], "Paladin & Archer": ["member", "No-Permissions"] }, "updatedAt": "2019-11-05T23:42:20.404Z", "teams": ["No Team"] } }, function (err2, result) {
            if (err2) throw err2;
            console.log('P&A team privileges added');
            // console.log('result: ', result);
            findNewUser();
            client.close();
            console.log('Database disconnected!');
        });
    });
}

function addPaTeam(browser) {
    browser.pause(1, function () { console.log('addPaTeam'); });
    browser.useCss().waitForElementVisible("#last-dropdown", 20000);
    browser.useCss().waitForElementVisible(".container", 20000);
    browser.pause(1100)
    browser.pause(1, function () { pateam(); });
    browser.pause(1100);
    browser.url("http://localhost:3000");
    browser.perform(function () {
        testConListHelper(30, "/html/body", browser);
    });
    browser.perform(function () {
        testConListHelper(30, "/html/body/div/div[1]/nav/div/div[2]/ul[1]/li[2]/a", browser);
    });
    browser.pause(1);
    browser.useCss();
    browser.waitForElementVisible('#nav-tsq', 18000);
}

function checkCharSheet(browser) {
    browser.pause(1, function () { console.log('checkCharSheet'); });
    browser.useXpath();
    browser.url("http://localhost:3000/char_sheet").waitForElementVisible("/html/body/div/div[2]/div/div[2]/div", 12000);
    browser
        .waitForElementVisible('/html/body/div/div[2]/div/div[2]/div/div[1]', 12000) // TSQ Character Sheet panel heading
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
    browser
        .waitForElementVisible('/html/body/div[1]/div[2]/div/div[2]/div/div[2]/div[2]/div[1]/h4', 12000) // TSQ Character Sheet Familiar Skills
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
    browser
        .waitForElementVisible('/html/body/div[1]/div[2]/div/div[2]/div/div[2]/div[2]/div[2]/h4', 12000) // TSQ Character Sheet Unfamiliar Skills
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
    browser
        .waitForElementVisible("#at-signUp", 12000)
        .click("#at-signUp")
    browser
        .waitForElementVisible("#at-field-email", 12000)
        .setValue("#at-field-email", `testUserForTsqNightwatchTest${randomNumber}@mydomain.com`)
    browser
        .waitForElementVisible("#at-field-password", 12000)
        .setValue("#at-field-password", "password")
    browser
        .waitForElementVisible("#at-field-password_again", 12000)
        .setValue("#at-field-password_again", "password")
    browser
        .waitForElementVisible("#at-field-first_name", 12000)
        .setValue("#at-field-first_name", "testUserForTsqNightwatchTest")
    browser
        .waitForElementVisible("#at-field-last_name", 12000)
        .setValue("#at-field-last_name", "testing")
    browser
        .waitForElementVisible("#at-field-access_code", 12000)
        .setValue("#at-field-access_code", "PADL")
    browser
        .waitForElementVisible("#at-btn", 12000)
        .click("#at-btn")
    // browser.waitForElementNotVisible("#at-field-email", 20000);
}

function tsqIntroAndUserLanguageList(browser) {
    browser.pause(100, function () { console.log('tsqIntroAndUserLanguageList'); });
    browser.useCss().url("http://localhost:3000/technicalSkillsQuestionaire/userLanguageList?h=2").waitForElementVisible("#__blaze-root > div.container.tsq", 12000);

    // for testing purposes
    browser.useCss().element("css selector", ".loading-animation", function (result) {
        // console.log('.loading-animation result: ', result);
    })

    browser.url(function (result) {
        // console.log('current url: ', result);
    })

    browser.element("css selector", ".gotohomepage", function (result) {
        // console.log('.gotohomepage result: ', result);
    })

    browser.waitForElementVisible(".btn-continue-intro", 12000)
    browser.pause(1500)

    browser.element("css selector", ".btn-continue-intro", function (result) {
        if (result.status === 0) {
            console.log('Intro page is visible! ', result);
            browser
                .waitForElementVisible(".btn-continue-intro", 12000)
                .click(".btn-continue-intro")
            browser.waitForElementVisible(".btn-continue-intro", 12000)
            browser
                .waitForElementVisible(".btn-continue-intro", 12000)
                .click(".btn-continue-intro")
            // browser
            //     .waitForElementVisible(".selectize-input", 24000)
            //     .click(".selectize-input")
            // browser
            //     .waitForElementVisible(".selectize-dropdown-content", 12000)
            // browser
            //     .useXpath()
            //     .click("//div[text()='JavaScript']")
            //     .useCss()
            //     .waitForElementVisible(".remove", 12000)
            // browser
            //     .click(".subtitles") // clicking on subtitles to close the dropdown
            browser
                .waitForElementVisible("#continue", 12000)
                .click("#continue")
        } else {
            console.log('Intro page is NOT visible! ', result);

            // browser
            //     .waitForElementVisible(".selectize-input", 24000)
            //     .click(".selectize-input")
            // browser
            //     .waitForElementVisible(".selectize-dropdown-content", 12000)
            // browser
            //     .useXpath()
            //     .click("//div[text()='JavaScript']")
            //     .useCss()
            //     .waitForElementVisible(".remove", 12000)
            // browser
            //     .click(".subtitles") // clicking on subtitles to close the dropdown
            browser
                .waitForElementVisible("#continue", 12000)
                .click("#continue")
        }
    })
}

function tsqFamiliarUnfamiliar(browser) {
    browser.pause(1, function () { console.log('tsqFamiliarUnfamiliar'); });
    browser.useCss();
    browser.waitForElementVisible(".unfamiliar-item-checkbox", 12000);
    browser.refresh();
    browser.waitForElementVisible(".unfamiliar-item-checkbox", 12000);
    browser
        .waitForElementVisible(".unfamiliar-item-checkbox", 12000)
        // .click(".unfamiliar-item-checkbox")
        .useXpath()
        // .moveTo("/html/body/div/div[2]/div[2]/div[2]/div/div/div[2]/ul/li[1]/div/label/input", 0, 0)
        // .moveToElement("/html/body/div/div[2]/div[2]/div[2]/div/div/div[2]/ul/li[1]/div/label/input", 0, 0)
        .pause(1100)
        .click("/html/body/div/div[2]/div[2]/div[2]/div/div/div[2]/ul/li[1]/div/label/input") // an unfamiliar checkbox
    browser.useCss()
        .waitForElementVisible("#continue", 12000)
        // .click("#continue")
        .useXpath()
        // .moveTo("/html/body/div/div[2]/div[3]/div[2]/button", 0, 0)
        // .moveToElement("/html/body/div/div[2]/div[3]/div[2]/button", 0, 0)
        .pause(1100)
        .click("/html/body/div/div[2]/div[3]/div[2]/button") // button for next page
}

function tsqConfidenceQnaire(browser) {
    browser.pause(1, function () { console.log('tsqConfidenceQnaire'); });
    browser.pause(1100)
    browser.refresh();
    browser.pause(3000)
    browser.useXpath();

    // makes sure the buttons are showing up (uses recursion)
    // browser.perform(function () {
    //     testConListHelper(70, "//*[@id='confidence_list'][10]/div/button[4]", browser);
    // });
    browser.waitForElementVisible("//*[@id='confidence_list'][10]/div/button[1]", 12000)
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

    browser.pause(1100);
    //         browser.waitForElementVisible(".nextLanguage", 12000)
    //         browser.getLocationInView(".nextLanguage").click(".nextLanguage")
    //         browser.pause(2000)
    //         browser.waitForElementVisible("div[class=panel-body]", 12000)

    //         browser.waitForElementVisible("#previous", 12000)
    //         browser.getLocationInView("#previous").click("#previous")
    //         browser.pause(1100)
    //         browser.waitForElementVisible("div[class=panel-body]", 12000)
    //         browser.pause(3000)

    //         browser.waitForElementVisible(".nextLanguage", 12000)
    //         browser.getLocationInView(".nextLanguage").click(".nextLanguage")
    //         browser.pause(1100)
    //         browser.waitForElementVisible("div[class=panel-body]", 12000)
    //         // browser.perform(function () {
    //         //     testConListHelper(70, "//*[@id='confidence_list']/div/button[3]", browser);
    //         // });
    //         browser.useXpath()
    //         browser.pause(3000);
    //         browser.waitForElementVisible("//*[@id='confidence_list']/div/button[3]", 12000)
    //         browser.getLocationInView("//*[@id='confidence_list']/div/button[3]")
    //         browser.click("//*[@id='confidence_list']/div/button[3]")
    //         browser.pause(1100);
    //         browser.useCss()

    function canClickResult(i, myBrowser) {
        let resultBtn = "/html/body/div[1]/div[2]/div[3]/div[2]/button";
        let quizBtn = "/html/body/div[1]/div[2]/div[2]/div[2]/div/div/div[2]/div/button[3]";
        console.log('testing');
        console.log('canClickResult i: ', i);
        myBrowser.element("xpath", resultBtn, function (result2) {
            if (result2.status > -1) {
                console.log('above -1');
                myBrowser.getLocationInView(quizBtn)
                myBrowser.click(quizBtn, function () {
                    myBrowser.pause(2000, function () {
                        myBrowser.getLocationInView(resultBtn)
                        myBrowser.click(resultBtn);
                    })
                })
            } else {
                console.log('not above -1');
                myBrowser.pause(1000, function () {
                    canClickResultHelper(i - 1, "/html/body/div[1]/div[2]/div[3]/div[2]/button", myBrowser);
                })
            }
        });
    }
    function canClickResultHelper(i, myBrowser) {
        if (i > 0) {
            canClickResult(i, myBrowser);
        } else {
            console.log('canClickResult i is 0 or less');
        }
    }

    browser.useCss();
    browser.element("css selector", "#showResults", function (result) {
        if (result.status > -1) {
            browser.getLocationInView("#showResults").click("#showResults")
        } else {
            browser.waitForElementVisible(".nextLanguage", 12000)
            browser.getLocationInView(".nextLanguage").click(".nextLanguage")
            browser.pause(2000)
            browser.waitForElementVisible("div[class=panel-body]", 12000)

            browser.useXpath();
            browser.perform(function () {
                canClickResultHelper(21, browser);
            });
        }
    });

    browser.useXpath();
    browser.waitForElementVisible("/html/body/div[1]/div[2]/div[2]/div[2]/div[2]/div[1]/p", 30000) // wait for results page to show up
    browser.pause(1100);
    // browser.useCss().getLocationInView("#showResults").click("#showResults")

    // // browser.useCss().pause(1100);
    // browser.element("css selector", "#showResults", function (result2) {
    //     console.log('second check');
    //     if (result2.status > -1) {
    //         console.log('above -1');
    //         browser.getLocationInView("#showResults").click("#showResults")
    //     } else {       
    //         console.log('not above -1');

    //         browser.waitForElementVisible("#previous", 12000)
    //         browser.getLocationInView("#previous").click("#previous")
    //         browser.pause(1100)
    //         browser.waitForElementVisible("div[class=panel-body]", 12000)

    //         browser.waitForElementVisible(".nextLanguage", 12000)
    //         browser.getLocationInView(".nextLanguage").click(".nextLanguage")
    //         browser.pause(1100)
    //         browser.waitForElementVisible("div[class=panel-body]", 12000)
    //         // browser.perform(function () {
    //         //     testConListHelper(70, "//*[@id='confidence_list']/div/button[3]", browser);
    //         // });
    //         browser.useXpath()
    //         browser.pause(3000);
    //         browser.waitForElementVisible("//*[@id='confidence_list']/div/button[3]", 12000)
    //         browser.getLocationInView("//*[@id='confidence_list']/div/button[3]")
    //         browser.click("//*[@id='confidence_list']/div/button[3]")
    //         browser.pause(1100);
    //         browser.useCss()

    //         browser.useXpath()
    //         browser.waitForElementVisible("//*[@id='confidence_list']/div/button[3]", 12000)
    //         browser.click("//*[@id='confidence_list']/div/button[3]")

    //         browser.useCss()
    //         browser.waitForElementVisible("#showResults", 8000)
    //         browser.waitForElementVisible("#showResults", 12000)
    //         browser.getLocationInView("#showResults").click("#showResults")
    //     }
    // });

    // browser.pause(2000)
}

function tsqResult(browser) {
    browser.pause(1, function () { console.log('tsqResult'); });
    browser.useCss();
    browser.waitForElementVisible("#restart", 12000)
    browser
        .waitForElementVisible("#restart", 12000)
}
