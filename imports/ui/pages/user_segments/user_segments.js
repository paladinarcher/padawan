import { UserSegment } from '/imports/api/user_segments/user_segments.js';
import './user_segments.html';

Template.user_segments.onCreated(function () {
    this.autorun( () => {
        this.subscription = this.subscribe('segmentList', this.userId, {
            onStop: function () {
                console.log("Segment List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Segment List subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription);
    });
});

Template.user_segments.helpers({
    segmentList() {
        let s = UserSegment.find();
        return s.fetch();
    }
});

Template.user_segments.events({
    'keyup input.edit':_.debounce(function (event, instance) {
        let segid = $(event.target).closest("[data-segid]").data("segid");
        console.log(segid, $(event.target).closest("[data-segid]"));
        let s = UserSegment.findOne( {_id:segid} );
        let name = $("#seg-name-"+segid).val();
        let dscr = $("#seg-dscr-"+segid).val();
        s.update(name, dscr);
    }, 2000),
    'keyup input.new':_.debounce(function (event, instance) {
        if ($("#seg-name-new").val() !== "") {
            $("#new-seg-save").prop("disabled", false);
        } else {
            $("#new-seg-save").prop("disabled", true);
        }
    }, 2000),
    'click #new-seg-save'(event, instance) {
        if ($("#seg-name-new").val() !== "") {
            let name = $("#seg-name-new").val();
            let dscr = $("#seg-dscr-new").val();
            Meteor.call('segment.createNewSegment', name, dscr);
            $("#seg-name-new").val("");
            $("#seg-dscr-new").val("");
        }
    }
});
