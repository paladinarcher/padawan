import { Template } from 'meteor/templating';
import './begin.html';



Template.begin.helpers({
    
    assessment() {
        let assess = FlowRouter.getParam('id');
        console.log(assess);
        return (assess || "MBTI");
    }

});

