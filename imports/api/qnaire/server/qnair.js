import { HelperPages } from '../../help/helperPages.js';
import { Qnaire } from '../qnaire.js';

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
const cacheTTL = Meteor.settings.public.Pages.Base.CacheTTL;

Qnaire.extend({
  meteorMethods: {
    getIntroHTML() {
      var date = new Date();
      //date.setDate(date.getDate() - 15);
      date.setMinutes(date.getMinutes() - cacheTTL);
      if(date < this.lastCheckedIntro) { return this.introCache; }
      if(this.introSlug == "") { 
        this.introSlug = this.title.toLowerCase().replace(/[^\w]+/g, "-")+"-introduction";
        console.log("Setting intro slug: "+this.introSlug);
      }
      var content = HelperPages.getPageContentBySlug(this.introSlug);
      this.introCache = content;
      this.lastCheckedIntro = new Date();
      this.save();
    },
    getInstructionHTML() {
      var date = new Date();
      //date.setDate(date.getDate() - 15);
      date.setMinutes(date.getMinutes() - cacheTTL);
      if(date < this.lastCheckedInstruction) { return this.instructionCache; }
      if(this.instructionSlug == "") { 
        this.instructionSlug = this.title.toLowerCase().replace(/[^\w]+/g, "-")+"-instructions";
        console.log("Setting instruction slug: "+this.instructionSlug);
      }
      var content = HelperPages.getPageContentBySlug(this.instructionSlug);
      this.instructionCache = content;
      this.lastCheckedInstruction = new Date();
      this.save();
    }
  }
});

export { Qnaire };
