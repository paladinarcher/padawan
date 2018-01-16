let MS_WAIT = 10000;
let uAdmin = {
    email: 'admin@mydomain.com',
    password: 'admin'
};
let uTest = {
    email: 'john@doe.com',
    password: 'johndoe',
    fname: 'John',
    lname: 'Doe'
}
let tTest = {
    name: "NW Test Team"
}
let gTest = {
    title: "NW Test Goal",
    description: "This is a description set by Nightwatch automated testing"
}
module.exports = {
    'Demo test Padawan' : function (client) {
        client
            .url('http://localhost:3000')
            .waitForElementPresent('body', MS_WAIT)
            .assert.title('Progressive Web Application');

        loginSequence(client, uAdmin);

        createTeamSequence(client, tTest.name);

        logoutSequence(client);

        registerSequence(client, uTest);

        client
            .waitForElementPresent('#nav-teams', MS_WAIT)
            .click("#nav-teams")
            .pause(1000)
            .click("#nav-teams")
            .waitForElementPresent('.btn-user-request-join', MS_WAIT)
            .click('.btn-user-request-join');

        logoutSequence(client);

        loginSequence(client, uAdmin);
        /*
        client
            .waitForElementPresent('#nav-teams', MS_WAIT)
            .click("#nav-teams")
            .waitForElementPresent('.btn-approve-join', MS_WAIT)
            .click(".btn-approve-join")
            .waitForElementPresent('[data-team-name="'+tTest.name+'"] .selectized', MS_WAIT)
            //first user added gets admin role
            .assert.containsText('[data-team-name="'+tTest.name+'"] .selectize-input.items', "admin")
            .click('[data-team-name="'+tTest.name+'"] .team-goal-quick-list')
            .waitForElementPresent('#btn-add-goal', MS_WAIT)
            .click('#btn-add-goal')
            .setValue("#goal-title-new", gTest.title)
            .setValue("#goal-description-new", gTest.description)
            .setValue("#div-goal-new .selectize-input input", uTest.fname)
            .keys(client.Keys.ENTER)
            .assert.containsText('#div-goal-new .selectize-input.items', uTest.fname + " " + uTest.lname)
            .click('#div-goal-new .btn-save')
            .pause(1000)
            .assert.containsText('.row.spaced.existing-goals .team-goal-title', gTest.title)
            .pause(5000)
            .end()
            */
    }
}

function loginSequence(client, user, password) {
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
        .click("#last-dropdown")
        .pause(100)
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
        .click('#at-btn')
        .pause(1000);
}
