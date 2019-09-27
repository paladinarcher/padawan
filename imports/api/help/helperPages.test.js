import { HelperPages } from "/imports/api/help/helperPages.js"


if (Meteor.isServer) {
    const helpBaseURL = Meteor.settings.public.Pages.Base.URL;
    const helpContext = Meteor.settings.public.Pages.Base.Context;
    const helpPassword = Meteor.settings.public.Pages.Base.Password;
    describe('helperPages', function () {
        // beforeEach(function () {
        //     helpBaseURL = Meteor.settings.public.Pages.Base.URL;
        //     helpContext = Meteor.settings.public.Pages.Base.Context;
        //     helpPassword = Meteor.settings.public.Pages.Base.Password;
        // });
        it('Can create HelperPages object', function () {
            // console.log('HelperPages: ', HelperPages);
            // console.log('is an object: ', typeof(HelperPages));
            // console.log('bool object: ', (HelperPages !== null) && (typeof HelperPages === "object"));
            chai.assert.isTrue((HelperPages !== null) && (typeof HelperPages === "object"), 'HelperPages is not an object');
        });
        //getPageBySlug
        it('getPageBySlug returns a url with the slug', function () {
            let myUrl = HelperPages.getPageBySlug('fiddlesticks-instructions');
            // console.log('myUrl: ', myUrl);
            // console.log('helpBaseURL: ', helpBaseURL);
            // console.log('helpContext: ', helpContext);
            // console.log('helpPassword: ', helpPassword);
            let slugRe = /fiddlesticks-instructions/;
            // slugRe = /supercalifrag/; // remove this
            chai.assert.isTrue(slugRe.test(myUrl), 'getPageBySlug does not add a url slug');

            let devRe = new RegExp(helpBaseURL);
            // devRe = /supercalifrag/; // remove this
            chai.assert.isTrue(devRe.test(myUrl), 'getPageBySlug does not add the base url');
            console.log('slug url: ', myUrl);
        });
        //getPageURL
        it('getPageByURL', function () {
            // console.log('pass in test: ', Meteor.settings.public.Pages);
            let myUrl = HelperPages.getPageURL();
            // console.log('myByUrl: ', myUrl);
            let contextRe = new RegExp(helpContext);
            // slugRe = /supercalifrag/; // remove this
            chai.assert.isTrue(contextRe.test(myUrl), 'getPageByUrl does not add a url slug');

            let devRe = new RegExp(helpBaseURL);
            // devRe = /supercalifrag/; // remove this
            chai.assert.isTrue(devRe.test(myUrl), 'getPageByUrl does not add the base url');

            let newPass = 'abc123';
            let newPassRe = new RegExp("&password=" + newPass);
            Meteor.settings.public.Pages.Base.Password = newPass;
            myUrl = HelperPages.getPageURL();
            // newPassRe = /supercalifrag/; // remove this
            chai.assert.isTrue(newPassRe.test(myUrl), 'getPageByUrl password is not in the url');


            newPass = '';
            newPassRe = new RegExp("&password=");
            Meteor.settings.public.Pages.Base.Password = newPass;
            myUrl = HelperPages.getPageURL();
            // newPassRe = /dev/; // remove this
            chai.assert.isFalse(newPassRe.test(myUrl), '&password= should not show up');

            Meteor.settings.public.Pages.Base.Password = helpPassword; //put password back
        });
        //getPageObject
        it('getPageObject returns an object', function (done) {
            this.timeout(10000); // giving extra time so Jenkins is less likely to crash
            let myUrl = HelperPages.getPageURL();
            let pageObj = HelperPages.getPageObject(myUrl)[0];
            // console.log('myUrl:', pageObj);
            // pageObj = []; // remove this
            chai.assert.isTrue((!Array.isArray(pageObj)) && (pageObj !== null) && (typeof pageObj === "object"), 'getPageObject did not return an object');
            done();
        })
        //getPageObjectBySlug
        it('getPageObjectBySlug', function () {
            console.log('todo');
        })
        //getPageContentBySlug
    });

}