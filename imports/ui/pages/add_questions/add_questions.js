import { Question } from '/imports/api/questions/questions.js';
import { User } from '/imports/api/users/users.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { TypeReading } from '/imports/api/type_readings/type_readings.js';
import { UserSegment } from '/imports/api/user_segments/user_segments.js';
import './add_questions.html';


Template.add_questions.onCreated(function () {
    this.autorun( () => {
        if (Roles.subscription.ready()) {
            if (!Roles.userIsInRole(Meteor.userId(),'admin',Roles.GLOBAL_GROUP)) {
                FlowRouter.redirect('/notfound');
            }
        }
    });
});

Template.add_questions.onCreated(function add_questionsOnCreated() {
    this._category = new ReactiveVar(FlowRouter.getParam('category'));
    this.category = () => this._category.get();
    this.convertCategory = (cat) => {
        if(cat === 'IE') { return 0; }
        if(cat === 'NS') { return 1; }
        if(cat === 'TF') { return 2; }
        if(cat === 'JP') { return 3; }
        return -1;
    };
    this.categoryToIndex = new ReactiveVar(this.convertCategory(this._category.get()));
    this.categoryCheck = () => {
        return {
            IE: this.category() === 'IE',
            NS: this.category() === 'NS',
            TF: this.category() === 'TF',
            JP: this.category() === 'JP'
        };
    };

    this.showModal = function(stuff) {
        let m = $('#tempModal');
        m.find('h4.modal-title').html(stuff.Title);
        m.find('div.modal-body').html(stuff.Body);
        m.find('div.modal-footer button.closebtn').html(stuff.CloseText);
        m.find('div.modal-footer button.savebtn').html(stuff.SaveText).click(stuff.SaveFunction);
        _.each(stuff.data, function (name, val) {
            m.data(name, val);
        });
        m.modal('show');
    };
    this.fixTabs = () => {
        let active = $('li[role=presentation].active a').data('type');
        console.log(active);
        $('tbody.edit-body').hide();
        $('#'+active+"Table").show();
    };
    this.makeModalStuff = function(title, body, closeText, saveText, saveFunction, data) {
        return {
            Title: title,
            Body: body,
            CloseText: closeText,
            SaveText: saveText,
            SaveFunction: saveFunction,
            data: data
        };
    };
    this.autorun( () => { console.log("autorunning...", this.categoryToIndex.get());
        this.subscription = this.subscribe('questions.bycategory', this.categoryToIndex.get(), {
            onStop: function () {
                console.log("Subscription stopped! ", arguments, this);
            }, onReady: function () {
                console.log("Subscription ready! ", arguments, this);
            },
            sort: {createdAt: -1}
        });
        console.log(this.subscription);
        this.subscription3 = this.subscribe('segmentList', this.userId, {
            onStop: function () {
                console.log("Segment List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Segment List subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription3);
    });
});

Template.add_questions.helpers({
    category() {
        return Template.instance().category();
    },
    categoryCheck() {
        return Template.instance().categoryCheck();
    },
    userSegmentList() {
        let segList = [];
        let s = UserSegment.find( );

        s.forEach((m) => {
            segList.push( {
                value: m._id,
                text: m.name
            });
        });
        return segList;
    },
    assignedUserSegments(q) {
        if (typeof q === "undefined") {
            return [];
        }
        let assigned = [];

        for (let i = 0; i < q.segments.length; i++) {
            let seg = UserSegment.findOne( {_id:q.segments[i]} );
            assigned.push( {
                value: q.segments[i],
                text: seg.name
            } );
        }
        return assigned;
    },
    questions() {
        let x = Question.find({
            Categories:parseInt(Template.instance().categoryToIndex.get())
        },{ sort: { createdAt: -1 } });
        return x;
    },
    questionAuthor(question) {
        let u = User.findOne(question.CreatedBy);
        return "<span style='white-space:nowrap;'>"+u.MyProfile.fullName()+" <span class='label label-warning'>"+u.MyProfile.UserType.Personality.getFourLetter()+"</span></span>";
    },
    getUserName(userId) {
        let u = User.findOne({_id:userId});
        u.callMethod('fullName', (err, result) => {
            console.log(err, result);
            return result;
        });
        //return u.fullName();
    },
    indexToCategory(ind) {
        if(ind === 0) { return 'IE'; }
        if(ind === 1) { return 'NS'; }
        if(ind === 2) { return 'TF'; }
        if(ind === 3) { return 'JP'; }
        return 'UN';
    },
    categoryToIndex(cat) {
        if(cat === 'IE') { return 0; }
        if(cat === 'NS') { return 1; }
        if(cat === 'TF') { return 2; }
        if(cat === 'JP') { return 3; }
        return -1;
    },
    categoryList() {
        let categories = [
            {text:'IE', value:0},
            {text:'NS', value:1},
            {text:'TF', value:2},
            {text:'JP', value:3}
        ];
        return categories;
    },
    averageAnswer(times, sum) {
        if(times === 0) { return 0; }
        return Math.round((Math.abs(sum) / times));
    },
    totalAnswers(right, left) {
        return right + left;
    },
    canDelete(question) {
        return (question.TimesAnswered.LeftSum + question.TimesAnswered.RightSum) < 1;
    }
});

Template.add_questions.events({
    'click button.quest-cat-select'(event, instance) {
        console.log('click button.quest-cat-select =>', event, instance);
        let newCat = $(event.target).data('category');
        FlowRouter.go("/addQuestions/"+newCat);
        instance._category.set(newCat);
        instance.categoryToIndex.set(instance.convertCategory(newCat));
        instance.fixTabs();
    },
    'click button.dropdown-toggle'(event, instance) {
        event.preventDefault();
        console.log('click button.dropdown-toggle => ',event, instance);
    },
    'click ul.dropdown-menu li a'(event, instance) {
        event.preventDefault();
        console.log('click ul.dropdown-menu li a => ', event, instance);
        let newCat = $(event.target).html();
        FlowRouter.go($(event.target).attr('href'));
        instance._category.set(newCat);
        instance.categoryToIndex.set(instance.convertCategory(newCat));
        //$('.Selected-Category').html(newCat);
        $('[name=Category]').val($(event.target).data('value'));
        $('button.quest-cat-select.cat-'+newCat).addClass('active');
        instance.fixTabs();
    },
    'click span.toggle-enable'(event, instance) {
        console.log('click span.toggle-enable => ', event, instance);
        let qid = $(event.target).closest('tr').data('id');
        let q = Question.findOne({_id:qid});
        q.Active = !q.Active;
        q.save();
    },
    'click span.delete'(event, instance) {
        event.preventDefault();
        console.log('click span.delete => ', event, instance);
        const target = event.target;
        let qid = $(target).data('qid');
        let vals = instance.makeModalStuff("Are you really sure?", "<h5>Do you really want to delete the question:</h5><table class='table table-bordered'><tr>"+$("#"+qid).html()+"</tr></table>", "No!", "I guess...", function (event) {
            $('#tempModal').modal('hide');
            $(this).off(event);
            Meteor.call('question.delete', qid, (error)=> {
                if(error) { console.log("Error on delete: ", error); }
                else {
                    console.log(qid+" should be deleted...");
                }
            });
        }, {qid:qid});
        instance.showModal(vals);
    },
    'submit #newQuestion'(event, instance) {
        event.preventDefault();
        console.log('submit #newQuestion => ', event, instance);

        const target = event.target;
        const values = {
            //'Category':target.Category.value,
            'Categories':$(target).find("#select-categories")[0].selectize.items,
            'Text':target.Text.value,
            'LeftText':target.LeftText.value,
            'RightText':target.RightText.value,
            'segments':($(target).find("#select-segments")[0].selectize ? $(target).find("#select-segments")[0].selectize.items : [])
        };
        console.log(values);

        Meteor.call('question.insert', values.Categories, values.Text, values.LeftText, values.RightText, values.segments, (error) => {
            if (error) {
                console.log("EEEEEERRRORRRRR: ", error);
            } else {
                target.Text.value = '';
                target.LeftText.value = '';
                target.RightText.value = '';
            }
        });
    }
});

Template.add_questions.onRendered(function() {
    $('.dropdown-toggle').dropdown();
    $('ul.nav-tabs li a').click(function (e) { e.preventDefault(); $(this).tab('show'); $('tbody.edit-body').hide(); $('#'+$(this).data('type')+"Table").show(); });
});
