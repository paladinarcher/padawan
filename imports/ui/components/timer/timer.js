import './timer.html';
import { Timer } from '/imports/api/timer/timer.js';

Template.timer.onCreated(function() {
    this.lssid = FlowRouter.getParam('lssid');
    this.subscribe('timersData', this.lssid);
})
Template.timer.helpers({
    timeSinceLastPresenterSelectedMinutes() {
        let timer = Timer.findOne( {presenterId:Template.instance().data.presenter.id} );
        if (!timer) {
            return null;
        }
        return ('0' + Math.floor(timer.time/60)).slice(-2);
    },
    timeSinceLastPresenterSelectedSeconds() {
        let timer = Timer.findOne( {presenterId:Template.instance().data.presenter.id} );
        if (!timer) {
            return null;
        }
        return ('0' + Math.floor(timer.time % 60)).slice(-2);
    },
});
