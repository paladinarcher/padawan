import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

if (typeof Meteor.settings.public.Pages == "undefined") {
  Meteor.settings.public.Pages = {
    Base: {
      URL: "http://developerlevel.com/wp-json/wp/v2/pages/",
      Password: "",
      Context: "view",
      CacheTTL: 1
    }
  };
}
const helpBaseURL = Meteor.settings.public.Pages.Base.URL;
const helpContext = Meteor.settings.public.Pages.Base.Context;
const helpPassword= Meteor.settings.public.Pages.Base.Password;

const HelperPages = {
  getPageBySlug(slug) {
    var url = this.getPageURL()+"&slug="+slug;
    return url;
  },
  getPageURL() {
    var url= helpBaseURL+"?context="+helpContext+(helpPassword != "" ? "&password="+helpPassword : "");
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