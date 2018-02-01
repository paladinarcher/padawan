import { User } from '/imports/api/users/users.js';
import './user_dashboard.html';
import '/imports/ui/pages/learn_share_list/learn_share_list.js';
import '/imports/ui/pages/home/home.js';

Template.user_dashboard.onCreated(function () {
    //
});

Template.user_dashboard.helpers({
    dashboardPanes() {
        let u = User.findOne( {_id: Meteor.userId()} );
        if (u && "undefined" !== typeof u.MyProfile.dashboardPanes && u.MyProfile.dashboardPanes.length > 0) {
            return u.MyProfile.dashboardPanes;
        } else {
            return [
                {
                    size: 6,
                    name: 'individual_goals',
                    title: 'Goals',
                    route: '/goals',
                    data: {}
                },
                {
                    size: 6,
                    name: 'admin_teams',
                    title: 'Teams',
                    route: '/adminTeams',
                    data: {}
                },
                {
                    size: 6,
                    name: 'learn_share_list',
                    title: 'Learn/Share',
                    route: '/learnShareList',
                    data: {}
                },
                {
                    size: 6,
                    name: 'user_profile',
                    title: 'Profile',
                    route: '/profile',
                    data: {}
                },
                {
                    size: 12,
                    name: 'App_home',
                    title: 'Questions',
                    route: '/',
                    data: {}
                },
            ];
        }
    }
})

Template.user_dashboard.events({
    'click div.dashboard-pane'(event, instance) {
        let target = $(event.target).data("route");
        if ("undefined" === target) {
            return;
        }
        FlowRouter.go(target);
    }
});
