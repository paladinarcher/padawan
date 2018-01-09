import './user_dashboard.html';
import '/imports/ui/pages/learn_share_list/learn_share_list.js';
import '/imports/ui/pages/home/home.js';

Template.user_dashboard.onCreated(function () {
    //
});

Template.user_dashboard.helpers({
    dashboardPanes() {
        console.log("be here now");
        /*
        pane {
            size
            name
            data
        }
        */
        return [
            {
                size: 8,
                name: 'App_home',
                title: 'Questions',
                route: '/',
                data: {}
            },
            {
                size: 4,
                name: 'learn_share_list',
                title: 'Learn/Share',
                route: '/learnShareList',
                data: {}
            },
            {
                size: 4,
                name: 'learn_share_list',
                title: 'Learn/Share',
                route: '/learnShareList',
                data: {}
            },
            {
                size: 8,
                name: 'admin_teams',
                title: 'Teams',
                route: '/adminTeams',
                data: {}
            },
        ];
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
