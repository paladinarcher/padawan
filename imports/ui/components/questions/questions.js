import { Question } from '/imports/api/questions/questions.js';
import { User, Profile, UserType, MyersBriggs, Answer } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import './questions.html';

Template.questions.onCreated(function () {
    this.autorun( () => { console.log("autorunning...");
        this.subscription = this.subscribe('questions.toanswer', Meteor.userId(), Session.get('refreshQuestions'), {
            onStop: function () {
                console.log("Subscription stopped! ", arguments, this);
            }, onReady: function () {
                console.log("Subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription);
    });
});

Template.questions.helpers({
    questions() {
        return Question.find({});
    },
    reversed(index) {
        return index % 2;
    },
    getTemplate() { //console.log(this.index, arguments, this);
        return (this.index % 2) ? Template.questionTemplate : Template.questionTemplateReversed;
    }
});

Template.questions.events({
    'click button.answer-button'(event, instance) {
        event.preventDefault();
        console.log('click button.answer-button => ', event, instance);
        
        const target = event.target;
        const parent = $(target).closest('div.answer-question');
        const values = {
            'questionId':parent.data('id'),
            'value':parent.data('value'),
            'isReversed':!!parent.data('reversed')
        };
        console.log(values);

        Meteor.call('question.answer', values.questionId, values.value, values.isReversed, (error) => {
            if (error) {
                console.log("EEEEEERRRORRRRR: ", error);
            } else {
                parent.remove();
                if($('div.answer-question').length < 1) {
                    Session.set('refreshQuestions', Math.random());
                }
            }
        });
    }
});
Template.question.helpers({
    getReadingsAsJSON(question) {
        return JSON.stringify(question.Readings);
    }
});
Template.question.onRendered(function() {
    console.log("onRendered", this);
    let updateValue = function(elem, value) {
        let parent = $(elem).data('value', value);
        parent.find('div.left-option span.percent').html(Math.abs(Math.round(value) - 50)+"%");
        parent.find('div.right-option span.percent').html((Math.round(value) + 50)+"%");
        updateBGOpacity($(elem).find('.left-option'), 0.5 - (value / 100));
        updateBGOpacity($(elem).find('.right-option'), 0.5 + (value / 100));
    };
    let updateBGOpacity = function(elem, value) {
        let m;
        m = $(elem).css('background-color').replace(/^rgba?\(|\s+|\)$/g,'').split(',');
        let btn = $(elem).parents('div.answer-question').find('button.answer-button');
        btn.css('visibility','visible');
        if(value > 0.5) {
            $(elem).css('color','white');
        } else if(value == 0.5) {
            $(elem).css('color','Grey');
            btn.css('visibility','hidden');
            value = 0.1;
        } else {
            $(elem).css('color','black');
        }
        let newRGBA = "rgba("+m[0]+", "+m[1]+", "+m[2]+", "+value+")";
        $(elem).css('background-color', newRGBA);
        //console.log($(elem).css('background-color'), m, newRGBA, value);
    }
    $('.slider', this.firstNode).each(function () {
        $(this).noUiSlider({
            start: $(this).data('value'),
            step:1,
            range: {
                min:-50,
                max:50
            }
        }).on('slide', function(event, val){ //console.log(arguments);
            updateValue($(event.target).closest('.answer-question'), val);
        }).on('set', function(event, val){
            updateValue($(event.target).closest('.answer-question'), val);
        });
        updateValue($(this).closest('.answer-question'), $(this).data('value'));
    });
});