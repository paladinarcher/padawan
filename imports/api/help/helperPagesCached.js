import { Meteor } from 'meteor/meteor';
import { HelperPages } from './helperPages.js';
import { NVCache } from '../nvcache/nvcache.js';

const HelperPagesCached = {
  getPageObjectBySlug(slug) {
    var ret = NVCache.findOne({name:slug});
    if(!ret) {
      ret = new NVCache();
      ret.name = slug;
    }
    if (ret.isExpired(Meteor.settings.public.Pages.Base.CacheTTL)) {
      ret.value = HelperPages.getPageObjectBySlug(slug);
      ret.save();
    }
    return ret.value;
  },
  getPageContentBySlug(slug) {
    var data= this.getPageObjectBySlug(slug).content.rendered;
    return data;
  }
};

export { HelperPagesCached };