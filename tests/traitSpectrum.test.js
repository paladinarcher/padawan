const randomNumber = (Math.floor(Math.random() * 100000) + 1) + Date.now();

module.exports = {
    "Take/Complete Trait Spectrum": function(browser) {
      browser.windowSize("current", "1200", "769"); // setting window size for this test
      browser.url("http://localhost:3000").waitForElementVisible("body", 12000);
  
      createNewUser(browser);
      takeTraitSpectrum(browser);
      viewTraitSpectrumResults(browser);
      browser.end();
    }
  };

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

function takeTraitSpectrum(browser) {
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
        for(let i = 0; i <= 23; i++) {
            browser.waitForElementVisible(".noUi-base", 8000);
            browser.useXpath()
            browser.verify
                .visible("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[1]/div[3]/div/div")
                .getLocationInView("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[1]/div[3]/div/div")
                .moveToElement("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[1]/div[3]/div/div", 150, 0).mouseButtonClick(0)
            browser.verify
                .visible("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[2]/div[3]/div/div")
                .getLocationInView("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[2]/div[3]/div/div")
                .moveToElement("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[2]/div[3]/div/div", 150, 0).mouseButtonClick(0)
            browser.verify
                .visible("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[3]/div[3]/div/div")
                .getLocationInView("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[3]/div[3]/div/div")
                .moveToElement("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[3]/div[3]/div/div", 150, 0).mouseButtonClick(0)
            browser.verify
                .visible("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[4]/div[3]/div/div")
                .getLocationInView("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[4]/div[3]/div/div")
                .moveToElement("//*[@id='__blaze-root']/div[2]/div[2]/div[2]/div[2]/div[1]/div[4]/div[3]/div/div", 150, 0).mouseButtonClick(0)
            browser.useCss()
            browser.verify
                .visible("#submitAll")
                .getLocationInView("#submitAll")
                .click("#submitAll")
        }
    })

}

function viewTraitSpectrumResults(browser) {
    browser.pause(1500)
    browser.getLocationInView("#nav-results")
    browser.verify
        .visible("#nav-results")
        .click("#nav-results")
    browser
        .waitForElementVisible("#trait_spectrum_results", 12000)
    browser.verify
        .visible("#results_descriptions")
        .getLocationInView("#results_descriptions")
        .click("#results_descriptions")
    browser.verify
        .visible("#trait_spectrum_results_descriptions", 12000)
}