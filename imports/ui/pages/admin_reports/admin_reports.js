import './admin_reports.html'
import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'

// onCreated
Template.admin_reports.onCreated(function () {
    this.autorun(() => {
        console.log(`subscribe to 'reports' db...`)
        this.subscription = this.subscribe('reports', {
            onStop: function () {
                console.log("Subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Subscription ready! ", arguments, this);
            }
        })
    })
})


// helpers
Template.admin_reports.helpers({

})

// events
Template.admin_reports.events({

})
