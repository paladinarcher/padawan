import { Template } from 'meteor/templating';
import './dl_footer.html';
import { User } from '/imports/api/users/users.js';

import '../../components/questions/questions.js';
import '../../components/personality/personality.js';
import '../../components/notification_list/notification_list.js';

import { FlowRouter } from 'meteor/kadira:flow-router';

Template.dl_footer.helpers({
    getYear() {
        return new Date().getFullYear();
    }
});
