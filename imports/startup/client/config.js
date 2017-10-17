Meteor.subscribe('userData');
Meteor.subscribe('teamsData', Meteor.userId(), {
    onReady: function() {
        console.log("teamsData subscription ready");
    }
});
