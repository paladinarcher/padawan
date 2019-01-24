import { Question } from '/imports/api/questions/questions.js';
import { User, Profile, UserType, MyersBriggs, Answer } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import './questions.html';

var minQuestionsAnswered = 72;

Template.questions.onCreated(function () {
    if (this.data.userId) {
        this.userId = this.data.userId;
    } else {
        this.userId = Meteor.userId();
    }

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
        return Question.find( );
    },
    
    reversed(index) {
        return index % 2;
    },
    remainingMinQCount() {
        let u = User.findOne({_id:Template.instance().userId});
        if (!u) return -1;
        let rmn = Math.max(0, (minQuestionsAnswered - u.MyProfile.UserType.AnsweredQuestions.length));
        return rmn;
    },
	remainingTotalQCount() {
        let u = User.findOne({_id:Template.instance().userId});
        if (!u) return -1;
		let total = 1; //for some reason if this is a negative number the submit button won't appear
        Meteor.call('question.countQuestions', u._id, (error, result) => {
            if (error) {
                //console.log("EEERRR0r: ", error);
				return -1
            } else {
                //success
        		total = Math.max(0, (result - u.MyProfile.UserType.AnsweredQuestions.length));
				return total;
            }
        });
		return total;
	},
    isRemainingGreaterThan(num) {
    let userId = {_id:Template.instance().userId};
    let u = User.findOne(userId);
    if (!u) return true;
    let rmn = Math.max(0, (minQuestionsAnswered - u.MyProfile.UserType.AnsweredQuestions.length));
    return rmn > num;
    },
    getTemplate() { //console.log(this.index, arguments, this);
        return (this.index % 2) ? Template.questionTemplate : Template.questionTemplateReversed;
    },
    answeredQuestionsLength() {
        let u = User.findOne({_id:Template.instance().userId});
        let length = u.MyProfile.UserType.AnsweredQuestions.length;
        return length;
    },
    totalQuestions() {
        let u = User.findOne({_id:Template.instance().userId});
        //console.log("myUserID", u._id);
        let total = u.MyProfile.UserType.getTotalQuestions();
        //console.log("preTotalQuestions", total);
        Meteor.call('question.countQuestions', u._id, (error, result) => {
            if (error) {
                //console.log("EEERRR0r: ", error);
            } else {
                //success
                //console.log("myUserID2", u._id);
                total = u.MyProfile.UserType.getTotalQuestions();
                u.MyProfile.UserType.setTotalQuestions(total);
                //console.log("uiquestionsjstotal", total);
                document.getElementById("allQuestions").innerHTML = "Total questions: " + result;
            }
        });
        return total;
    },
    currentResultsTrue(){
        let u = User.findOne({_id:Template.instance().userId});
        let length = u.MyProfile.UserType.AnsweredQuestions.length;
        return length >= minQuestionsAnswered && length < 122;
    },
    finalResultsTrue(){
        let u = User.findOne({_id:Template.instance().userId});
        let length = u.MyProfile.UserType.AnsweredQuestions.length;
        return length >= 122;
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

        console.log('hahahahahaahah');
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
    },
    'click a#nav-results'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/results');
    },
    'click button#submitAll'(event, instance){
        event.preventDefault();
        let btn = $('button.answer-button');
        let submit = $('button#submitAll');
        // $.each(btn, function(){
        //     if (btn.hidden = true){
        //         submit.css('visibility', 'hidden');
        //     } else {
        //         submit.css('visibility', 'visible');
        //     }
        // });
        
        // $.each(btn, function ){
        //     btn.click();
        // });
    //    if(values == 0.5) {
    //         submit.css('visibility','hidden');
    //     } 
        btn.click();
        console.log('heheheheheheeh');
        console.log(btn.hidden);
        console.log(btn);
    }
});

Template.question.helpers({
    getReadingsAsJSON(question) {
        return JSON.stringify(question.Readings);
    }
});
Template.question.onRendered(function() {
    console.log("onRendered", this);
    let hidebtn = $('button.answer-button');
    let submit = $('button#submitAll');
    // $.each(hidebtn, function(){
    //         if (hidebtn.hidden = true){
    //             submit.css('visibility', 'hidden');
    //         } else {
    //             submit.css('visibility', 'visible');
    //         }
    //     });
    
    let updateValue = function(elem, value) {
        let parent = $(elem).data('value', value);
        parent.find('div.left-option span.percent').html(Math.abs(Math.round(value) - 50)+"%");
        parent.find('div.right-option span.percent').html((Math.round(value) + 50)+"%");
        updateBGOpacity($(elem).find('.left-option'), 0.5 - (value / 100));
        updateBGOpacity($(elem).find('.right-option'), 0.5 + (value / 100));
        updateReading(parent, value);
    };
    let updateReading = function(elem, value) {
        let readings = $(elem).data('readings');
        let index = -1;
        let curMax = (value < 0 ? -100 : 100);
        $.each(readings, function (i, reading) {
            if((value < 0 && reading.Rank <= value && reading.Rank > curMax) || (value > 0 && reading.Rank >= value && reading.Rank < curMax)) {
                index = i;
                curMax = reading.Rank
            }
        });
        if(index < 0) { return; }
        $(elem).find('div.reading').html(readings[index].Text);
    };
    let updateBGOpacity = function(elem, value) {
        let m;
        m = $(elem).css('background-color').replace(/^rgba?\(|\s+|\)$/g,'').split(',');
        let btn = $(elem).parents('div.answer-question').find('button.answer-button');
        let submit = $('button#submitAll');
        let reading = $(elem).parents('div.answer-question').find('div.reading');
        reading.css('visibility', 'visible');
        //btn.css('visibility','visible');
        btn.show();
        submit.show();
        //submit.css('visibility','hidden');
        let remainingQs = Number(document.getElementById('remainingQs').innerHTML);
        if (remainingQs > 1) {
            btn[0].innerHTML = "Continue";
        } else {
            if (remainingQs <= 0) {
                //btn.css('visibility', 'hidden');
                btn.hide()
                //submit.hide();
            } else {
                btn[0].innerHTML = "Submit Answers";
            }
        }
        console.log('heheheheeheheh');
        console.log(hidebtn[0].style.display);
        //console.log($('.slider')[0]);
        console.log(value);
        let btn1 = hidebtn[0].style.display;
        let btn2 = hidebtn[1].style.display;
        let btn3 = hidebtn[2].style.display;
        let btn4 = hidebtn[3].style.display;
        $.each(hidebtn, function(){
            return hidebtn;
        });
            // if (remainingQs >= 0) {
            //     //submit.show();
            // } 
            if (value == 0.5){
                submit.hide();
            }
            //$.each(value, function (){
                if (btn1 == 'none' || btn2 == 'none' || btn3 == 'none' || btn4 == 'none') {
                    submit.hide();
                }
            //})

        if(value > 0.5) {
            $(elem).css('color','white');
        } else if(value == 0.5) {
            $(elem).css('color','Grey');
            // btn.css('visibility','hidden');
            btn.hide();
            reading.css('visibility','hidden');
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


