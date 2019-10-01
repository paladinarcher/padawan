import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

const helpBaseURL = Meteor.settings.public.Pages.Base.URL;
const helpContext = Meteor.settings.public.Pages.Base.Context;
const helpPassword= Meteor.settings.public.Pages.Base.Password;

const HelperPages = {
  getPageBySlug(slug) {
    var url = this.getPageURL()+"&slug="+slug;

    // console.log('in helper:');
    // console.log('helpBaseURL: ', helpBaseURL);
    // console.log('helpContext: ', helpContext);
    // console.log('helpPassword: ', helpPassword);

    return url;
  },
  getPageURL() {
    let pass = Meteor.settings.public.Pages.Base.Password;
    var url= helpBaseURL+"?context="+helpContext+(pass != "" ? "&password="+pass : "");
    return url;
  },
  getPageObject(url) {
    console.log("Getting help page from "+url);
    const response = HTTP.get(url);
    return response.data;
  },
  getPageObjectBySlug(slug) {
    var obj = this.getPageObject(this.getPageBySlug(slug));
    if (Array.isArray(obj) && obj.length > 0) {
      var page = obj[0];
      return page;
    }
    return {content:{rendered:""}};
  },
  getPageContentBySlug(slug) {
    var data= this.getPageObjectBySlug(slug).content.rendered;
    //console.log(data);
    return data;
  }
};

export { HelperPages };