import { Question } from '/imports/api/questions/questions.js';
import { User } from '/imports/api/users/users.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { TypeReading } from '/imports/api/type_readings/type_readings.js';
import './add_readings.html';


Template.add_readings.onCreated(function () {
    this.autorun( () => {
        if (Roles.subscription.ready()) {
            if (!Roles.userIsInRole(Meteor.userId(),'admin',Roles.GLOBAL_GROUP)) {
                FlowRouter.redirect('/notfound');
            }
        }
    });
});

Template.add_readings.onCreated(function add_readingsOnCreated() {
        
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
    this.autorun( () => { 
        this.subscription = this.subscribe('typereadings.getAll', {
            onStop: function () {
                console.log("Subscription stopped! ", arguments, this);
            }, onReady: function () {
                console.log("Subscription ready! ", arguments, this);
            },
            sort: { "TypeReadingCategories.Range.Delta": -1 }
        });
        console.log(this.subscription);
    });
});

Template.add_readings.helpers({
    readings() {
        return TypeReading.find({ },{ sort: { "TypeReadingCategories.Range.low": 1, "TypeReadingCategories.Range.Delta": -1 } });
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
    readingHasCategory(reading, category) {
        return (!!reading.TypeReadingCategories[category]);
    },
    readingCategory(reading, category) {
        if(!reading.TypeReadingCategories[category]) {
            return "-";
        } else {
            return "from "+reading.TypeReadingCategories[category].Range.low + " to " + reading.TypeReadingCategories[category].Range.high;
        }
    },
    getRange(reading, category, isHigh) {
        if(!reading.TypeReadingCategories[category]) {
            return "";
        }
        return (isHigh ? reading.TypeReadingCategories[category].Range.high : reading.TypeReadingCategories[category].Range.low);
    },
    readingAuthor(reading) {
        let u = User.findOne(reading.CreatedBy);
        return u.MyProfile.fullName()+" <span class='label label-warning'>"+u.MyProfile.UserType.Personality.getFourLetter()+"</span>";
    },
    getUserName(userId) {
        let u = User.findOne({_id:userId});
        u.callMethod('fullName', (err, result) => {
            console.log(err, result);
            return result;
        });
        //return u.fullName();
    }
});

Template.add_readings.events({
    'click span.toggle-enable-reading'(event, instance) {
        console.log('click span.toggle-enable-reading => ', event, instance);
        let rid = $(event.target).closest('tr').data('id');
        Meteor.call('typereadings.toggle', rid, (error) => {
            if(error) { console.log("Error on toggle reading: ",error); }
            else { console.log(rid+" should be toggled."); }
        });
    },
    'click span.delete-reading'(event, instance) {
        event.preventDefault();
        console.log('click span.delete-reading => ', event, instance);
        const target = event.target;
        let rid = $(target).data('rid');
        let vals = instance.makeModalStuff("Are you really sure?", "<h5>Do you really want to delete the reading:</h5><table class='table table-bordered'><tr>"+$("#"+rid).html()+"</tr></table>", "No!", "I guess...", function (event) {
            $('#tempModal').modal('hide');
            $(this).off(event);
            Meteor.call('typereadings.delete', rid, (error)=> {
                if(error) { console.log("Error on delete: ", error); }
                else {
                    console.log(rid+" should be deleted...");
                }
            });
        }, {rid:rid});
        instance.showModal(vals);
    },
    'click #addTypeReadingLink'(event, instance) {
        event.preventDefault();
        if($('span', event.target).hasClass('glyphicon-chevron-down')) {
            $('span', event.target).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
            $('div.add-type-reading').slideDown(300);
        } else {
            $('span', event.target).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
            $('div.add-type-reading').slideUp(300);
        }
    },
    'click a.readingCategoryLink'(event, instance) {
        event.preventDefault();
        var me = $(event.target);
        var parentData = me.parent().get(0).dataset;
        var cat = parseInt(parentData.category);
        var hi  = parentData.high;
        var low = parentData.low;
        var mom = me.parents('div.row:first');
        mom.find('input[name=Category]').val(cat);
        mom.find('span.readingCategoryDisplay').html(instance.view.template.__helpers[" indexToCategory"](cat));
        mom.find('input[name=Low]').val(low);
        mom.find('input[name=High]').val(hi);
        if(!mom.find('.expansion-drawer').is(':visible')) {
            $('.expansion-drawer').slideUp(300);
            mom.find('.expansion-drawer').slideDown(300);
        }
    },
    'submit #newReading'(event, instance) {
        event.preventDefault();
        console.log('submit #newReading => ', event, instance);
        
        const target = event.target;
        const values = {
            'Header':target.Header.value,
            'Body':target.Body.value,
        };
        console.log(values);

        Meteor.call('typereadings.insert', values.Header, values.Body, (error) => {
            if (error) {
                console.log("EEEEEERRRORRRRR: ", error);
            } else {
                target.Header.value = '';
                target.Body.value = '';
            }
        });
    },
    'submit form.addCategoryToReadingForm'(event, instance) {
        event.preventDefault();
        const target = event.target;
        const values = {
            Category: target.Category.value,
            High: target.High.value,
            Low: target.Low.value,
            ReadingId: target.readingId.value
        };
        Meteor.call('typereadings.addCategoryToReading', values.ReadingId, values.Category, values.High, values.Low, (error) => {
            if(error) {
                console.log("EEEEEEEEEEERRRRRRRRRRROOOOOOOOORRRRR: ", error);
            } else {
                console.log("We good, man!");
                target.Low.value = '';
                target.High.value = '';
            }
        });
    }
});

Template.add_readings.onRendered(function() {
    
});