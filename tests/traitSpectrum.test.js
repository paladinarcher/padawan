const randomNumber = (Math.floor(Math.random() * 100000) + 1) + Date.now(); 
 
module.exports = {
    "Take/Complete Trait Spectrum": function (browser) {
        var runtimeBrowser = browser.capabilities.browserName.toUpperCase();
        if (runtimeBrowser == "CHROME") {
            console.log('CHROME');
            browser.windowSize("current", "1200", "769"); // setting window size for this test
            browser.url("http://localhost:3000/signin").waitForElementVisible("body", 12000);

            // loginAdmin(browser); //Use this function when testing so you don't keep taking the trait spectrum
            createNewUser(browser);
            takeTraitSpectrumChrome(browser);
            viewTraitSpectrumResults(browser);
            checkCharSheet(browser);

            browser.pause(3000);
            browser.end()
        }
        if (runtimeBrowser == "FIREFOX") {
            console.log('FIREFOX');
            browser.windowSize("current", "1200", "769"); // setting window size for this test
            browser.url("http://localhost:3000/signin").waitForElementVisible("body", 12000);

            // loginAdmin(browser); //Use this function when testing so you don't keep taking the trait spectrum
            createNewUser(browser);
            takeTraitSpectrumFirefox(browser);
            viewTraitSpectrumResults(browser);
            checkCharSheet(browser);

            // browser.pause(3000);
            browser.end();
        }
    }
};

function loginAdmin(browser) {
    let email = 'acidberry@mydomain.com';
    let password = 'password';
    browser.url("http://localhost:3000/signin").waitForElementVisible("body", 12000);
    browser.verify
        .visible("#at-field-email")
        // .click("#at-field-email")
        .clearValue("#at-field-email")
        .setValue("#at-field-email", email)
        .clearValue("#at-field-password")
        .setValue("#at-field-password", password)
        .click("#at-btn")
        .waitForElementVisible("#last-dropdown", 12000)
}

function checkCharSheet(browser) {
    browser.useCss();
    browser.url("http://localhost:3000/char_sheet").waitForElementVisible("body", 12000);
    browser.verify
        .visible(".panel-heading")
        .getText(".panel-heading", function (result) { 
            // console.log('result: ', result);
            if (result.value == 'Trait Spectrum - Complete') {
                console.log('true: Trait Spectrum - Complete');
            } else {
                console.log('false: Trait Spectrum - Complete');
                throw new Error('false: Trait Spectrum - Complete');
            }
        })
    browser.useXpath();
    browser.verify.visible('/html/body/div/div[2]/div/div/div/div[2]/div[1]/a/div/h2'); // 4 letters
    browser.verify.visible('/html/body/div/div[2]/div/div/div/div[2]/div[1]/div[2]'); // progress bar
    browser.verify.visible('/html/body/div/div[2]/div/div/div/div[2]/div[2]/div'); // polygon circle
    browser.verify.visible('/html/body/div/div[2]/div/div/div/div[2]/div[1]/a/div/h2'); // dot circle
    
    browser.useCss();
    // browser.pause(3000);
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



function takeTraitSpectrumChrome(browser) {
    browser.verify
        .visible("#nav-traitSpectrum")
        .click("#nav-traitSpectrum")
    browser.waitForElementVisible(".size-full", 8000)
    browser.verify
        .visible(".btn-continue-intro")
        .click(".btn-continue-intro")
    browser.waitForElementVisible(".size-full", 8000)
    browser.verify
        .visible(".btn-continue-intro")
        .click(".btn-continue-intro")

    browser.perform(() => {
        for (let i = 0; i <= 20; i++) {
            browser.waitForElementVisible(".noUi-base", 8000);
            browser.useXpath()
            browser.verify
                .visible("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[1]/div[3]/div/div")
                .getLocationInView("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[1]/div[3]/div/div")
                .moveToElement("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[1]/div[3]/div/div", 150, 0).mouseButtonClick(0)
                .click("/html/body/div/div[2]/div[2]/div[2]/div[2]/div[1]/div[1]/div[3]/div/div/div/div");
            browser.verify
                .visible("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[2]/div[3]/div/div")
                .getLocationInView("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[2]/div[3]/div/div")
                .moveToElement("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[2]/div[3]/div/div", 150, 0).mouseButtonClick(0)
                .click("/html/body/div/div[2]/div[2]/div[2]/div[2]/div[1]/div[2]/div[3]/div/div/div/div");
            browser.verify
                .visible("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[3]/div[3]/div/div")
                .getLocationInView("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[3]/div[3]/div/div")
                .moveToElement("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[3]/div[3]/div/div", 150, 0).mouseButtonClick(0)
                .click("/html/body/div/div[2]/div[2]/div[2]/div[2]/div[1]/div[3]/div[3]/div/div/div/div");
            browser.verify
                .visible("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[4]/div[3]/div/div")
                .getLocationInView("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[4]/div[3]/div/div")
                .moveToElement("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[4]/div[3]/div/div", 150, 0).mouseButtonClick(0)
                .click("/html/body/div/div[2]/div[2]/div[2]/div[2]/div[1]/div[4]/div[3]/div/div/div/div");
            browser.useCss()
            browser.verify
                .visible("#submitAll")
                .getLocationInView("#submitAll")
                .click("#submitAll")
        }
    })

}

function takeTraitSpectrumFirefox(browser) {
    browser.verify
        .visible("#nav-traitSpectrum")
        .click("#nav-traitSpectrum")
    browser.waitForElementVisible(".size-full", 8000)
    browser.verify
        .visible(".btn-continue-intro")
        .click(".btn-continue-intro")
    browser.waitForElementVisible(".size-full", 8000)
    browser.verify
        .visible(".btn-continue-intro")
        .click(".btn-continue-intro")

    browser.perform(function() {
        for(let i = 0; i <= 20; i++) {
            browser.waitForElementVisible(".noUi-base", 8000);
            browser.useXpath()
            browser.verify
                .visible("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[1]/div[3]/div/div/div")
                .getLocationInView("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[1]/div[3]/div/div/div")
                .moveToElement("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[1]/div[3]/div/div/div", 200, 0).mouseButtonClick(0)
            browser.verify
                .visible("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[2]/div[3]/div/div/div")
                .getLocationInView("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[2]/div[3]/div/div/div")
                .moveToElement("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[2]/div[3]/div/div/div", 200, 0).mouseButtonClick(0)
            browser.verify
                .visible("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[3]/div[3]/div/div/div")
                .getLocationInView("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[3]/div[3]/div/div/div")
                .moveToElement("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[3]/div[3]/div/div/div", 200, 0).mouseButtonClick(0)
            browser.verify
                .visible("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[4]/div[3]/div/div/div")
                .getLocationInView("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[4]/div[3]/div/div/div")
                .moveToElement("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[4]/div[3]/div/div/div", 200, 0).mouseButtonClick(0)
            browser.useCss()
            browser.verify
                .visible("#submitAll")
                .getLocationInView("#submitAll")
                .click("#submitAll")
        }
    })
}

function viewTraitSpectrumResults(browser) {
    browser.getLocationInView(".nav-results-button")
    browser.verify
        .visible(".nav-results-button")
        .click(".nav-results-button")
    browser.waitForElementVisible("#trait_spectrum_results", 12000)
    browser.verify.visible("#results_descriptions")

    // this is causing fail as well
    // .getLocationInView("#results_descriptions")
    // .click("#results_descriptions")

    browser.url("http://localhost:3000/resultsDescriptions").waitForElementVisible("#trait_spectrum_results_descriptions", 12000)

    // browser.verify.visible("#trait_spectrum_results_descriptions", 12000)
}
