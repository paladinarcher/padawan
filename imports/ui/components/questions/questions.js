import { Question } from '/imports/api/questions/questions.js';
import { User, Profile, UserType, MyersBriggs, Answer } from '/imports/api/users/users.js';
import { HelpText } from '/imports/client/clientSideDbs';
import { Meteor } from 'meteor/meteor';
import './questions.html';

var minQuestionsAnswered = Question.MIN_ANSWERED;
var stoppedList = [];

Template.questions.onCreated(function () {
    if (this.data.userId) {
        this.userId = this.data.userId;
    } else {
        this.userId = Meteor.userId();
    }
    this._helpLevel = new ReactiveVar((!isNaN(parseInt(FlowRouter.getQueryParam('h'))) ? FlowRouter.getQueryParam('h') : (!isNaN(parseInt(localStorage.getItem('questions-h'))) ? localStorage.getItem('questions-h') : "")));
    this.helpLevel = () => this._helpLevel.get();
    Template.questions.__helpers[" introLevel"](this.helpLevel());
    stoppedList = [];

    this.autorun( () => { console.log("autorunning...");
        this.subscription = this.subscribe('questions.toanswer', Meteor.userId(), Session.get('refreshQuestions'), {
            onStop: function () {
              stoppedList = Template.questions.__helpers[" questions"]().fetch();
              console.log("Subscription stopped! ", stoppedList);

            }, onReady: function () {
                console.log("Subscription ready! ", Template.questions.__helpers[" questions"]().fetch());
                Template.questions.__helpers[" checkQuestions"]();
            }
        });
        console.log(this.subscription);
        this.subscription2 = this.subscribe('questions.helperTexts', {
          onReady: () => (Meteor.isDevelopment) ? console.log({ subName: 'questions.helperTexts', readyStatus: true, arguments, THIS: this}) : null,
          onError: () => (Meteor.isDevelopment) ? console.log({ subName: 'questions.helperTexts', readyStatus: false, arguments, THIS: this}) : null,
          onStop: () => (Meteor.isDevelopment) ? console.log({ subName: 'questions.helperTexts', readyStatus: false, arguments, THIS: this}) : null,
        });
    });
});

Template.questions.helpers({
  checkQuestions() {
    if(FlowRouter.getRouteName() !== "ask_questions") { 
      return; 
    }
    var c = Template.questions.__helpers[" questions"]().fetch();
    var s = stoppedList;
    var n = [];
    big: for(i=0;i<c.length;i++) {
      for(j=0;j<s.length;j++) {
        if(c[i]._id === s[j]._id) { continue big; }
      }
      n.push(c[i]);
    }
    if(n.length === 0) {
      FlowRouter.go('/results');
    }
  },
    questions() {
        return Question.find( );
    },
    getIntroInstructions() {
      var tmp = HelpText.findOne();
      console.log(tmp);
      return tmp;
    },
    getIntroHTML() {
      var tmp = Template.questions.__helpers[" getIntroInstructions"]();
      return tmp.Intro;
    },
    getInstructionsHTML() {
      var tmp = Template.questions.__helpers[" getIntroInstructions"]();
      return tmp.Instructions;
    },
    hasIntro() {
      var tmp = Template.questions.__helpers[" getIntroInstructions"]();
      return tmp != null && typeof tmp.Intro != "undefined" && tmp.Intro != "";
    },
    hasInstructions() {
      var tmp = Template.questions.__helpers[" getIntroInstructions"]();
      return tmp != null && typeof tmp.Instructions != "undefined" && tmp.Instructions != "";
    },
    hasIntroInstructions() {
      return Template.questions.__helpers[" hasIntro"]() || Template.questions.__helpers[" hasInstructions"]();
    },
    introLevelIntro() {
      var lvl = Template.instance().helpLevel();
      return lvl == 2;
    },
    introLevelInstructions() {
      var lvl = Template.instance().helpLevel();
      return lvl == 1;
    },
    introLevelMain() {
      var lvl = Template.instance().helpLevel();
      return lvl != 1 && lvl != 2;
    },
    introLevel(lvl) {
      if(typeof lvl == "undefined" || isNaN(parseInt(lvl))) { lvl = FlowRouter.getQueryParam('h'); }
      if(typeof lvl == "undefined" || isNaN(parseInt(lvl))) { lvl = Session.get('questions-h'); }
      if(typeof lvl == "undefined" || isNaN(parseInt(lvl))) { lvl = 20; }
      if(lvl < 0) { lvl = 0; }
      if(lvl > 2) { lvl = 2; }
      Template.instance()._helpLevel.set(lvl);
      localStorage.setItem('questions-h',lvl);
      return Template.instance().helpLevel();
    },
    reversed(index) {
        return index % 2;
    },
    mbtiTotalQuestions() {
        return Session.get('allMbtiQuestions');
    },
    totalQuestions() {
        return Session.get('totalMbtiQuestions');
    },
    finishedPercent() {
        let u = User.findOne({_id:Template.instance().userId});
        let fin = u.MyProfile.UserType.AnsweredQuestions.length;
        let tot = Session.get('totalMbtiQuestions');
        if(u) {
            return (fin/tot)*100;
        }
        return 0;
    },
    unfinishedPercent() {
        let u = User.findOne({_id:Template.instance().userId});
        let fin = u.MyProfile.UserType.AnsweredQuestions.length;
        let tot = Session.get('totalMbtiQuestions');
        let min = minQuestionsAnswered;
        if(u) {
            let finpct = (fin/tot)*100;
            let minpct = (min/tot)*100;
            let actminpct = minpct - finpct;
            if(actminpct > 0) {
                return actminpct;
            }
            return 0;
        }
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
    },
    contextMenuGone(){
        event.preventDefault();
        let menu = $('#context-menu-div');
        if (menu.css('display') == 'block') {
            return 'none';
        } else {
            return 'block';
        }
    }
});

Template.questions.events({
    'click button#nav-results'(event, instance) {
        event.preventDefault();
        FlowRouter.go('/results');
    },
    // submit all answers
    'click button#submitAll'(event, instance){
        event.preventDefault();
        const ans = $('div.answer-question');
        ans.each(function(){    
            const val = {
                questionId: $(this).data('id'),
                value: $(this).data('value'),
                isReversed: !!$(this).data('reversed')
            }
            Meteor.call('question.answer', val.questionId, val.value, val.isReversed, (error) => {
                if (error) {
                    console.log("EEEEEERRRORRRRR: ", error);
                // } else {
                //     $(this).remove();
                //     if($('div.answer-question').length < 1) {
                //         Session.set('refreshQuestions', Math.random());
                //     }
                }
            });
        })
        ans.remove();
        if($('div.answer-question').length < 1) {
            Session.set('refreshQuestions', Math.random());
        }
    },
    'click button.btn-back-intro'(event, instance) {
      var lvl = instance.view.template.__helpers[" introLevel"](instance._helpLevel.get() + 1);
      FlowRouter.go("/questions?h="+lvl);
    },
    'click button.btn-continue-intro'(event, instance) {
      var lvl = instance.view.template.__helpers[" introLevel"](instance._helpLevel.get() - 1);
      FlowRouter.go("/questions?h="+lvl);
    },
    'click span.showIntro'(event, instance) {
      var lvl = instance.view.template.__helpers[" introLevel"](2);
      FlowRouter.go("/questions?h="+lvl);
    },
    'click span.showInstructions'(event, instance) {
      var lvl = instance.view.template.__helpers[" introLevel"](1);
      FlowRouter.go("/questions?h="+lvl);
    }
});

Template.question.helpers({
    getReadingsAsJSON(question) {
        return JSON.stringify(question.Readings);
    }
});
Template.question.onRendered(function() {
    console.log("onRendered", this);
    //let hidebtn = $('button.answer-button');
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
        let reversed = $(elem).data('reversed');
        let index = -1;
        let curMax = (value < 0 ? -100 : 100);
        $.each(readings, function (i, reading) {
          let rank = reading.Rank
          if(reversed) {
            rank = -rank;
          }
            if((value < 0 && rank <= value && rank > curMax) || (value > 0 && rank >= value && rank < curMax)) {
                index = i;
                curMax = rank
            }
        });
        if(index < 0) { return; }
        $(elem).find('div.reading').html(readings[index].Text);
    };
    let updateBGOpacity = function(elem, value) {
        let m;
        m = $(elem).css('background-color').replace(/^rgba?\(|\s+|\)$/g,'').split(',');
        //let btn = $(elem).parents('div.answer-question').find('button.answer-button');
        let submit = $('button#submitAll');
        let reading = $(elem).parents('div.answer-question').find('div.reading');
        reading.css('visibility', 'visible');
        //btn.css('visibility','visible');
        submit.attr('disabled',false);
        let remainingQs = false;
        $('div.answer-question').each(function() { remainingQs = remainingQs || $(this).data('value') == 0; });
        if (!remainingQs) {
            //btn[0].innerHTML = "Continue";
            submit.removeAttr('disabled');
        } else {
            submit.attr('disabled',true);
        }
        // Hides the submit all button unless all Qs are answered.
        //hidebtn.each(function(i){
        //   if(hidebtn[i].style.visibility == 'hidden'){
        //       submit.attr('disabled',true);
        //   }
        //});

        if(value > 0.5) {
            $(elem).css('color','white');
        } else if(value == 0.5) {
            $(elem).css('color','Grey');
            //btn.css('visibility','hidden');
            // when Q's are unansewered submit all button hides
            submit.attr('disabled',true);
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