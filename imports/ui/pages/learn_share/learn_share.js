import { User } from '/imports/api/users/users.js';
import { LearnShareSession } from '/imports/api/learn_share/learn_share.js';
import './learn_share.html';
import '/imports/ui/components/label_list/label_list.js';

var generateGuestId = () => {
    var text = "guest-";
    var idLength = 11;
    var possible = "acdeghijklmnopqrstuvwxyzACDEGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < idLength; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

Template.learn_share.onCreated(function () {
    this.lssid = FlowRouter.getParam('lssid');
    if (!Meteor.user()) {
        //user not logged in, treat as guest
        let gname = Session.get("guestName");
        if ("undefined" === typeof gname) {
            let gid = generateGuestId();
            Session.setPersistent("guestName", 'G'+gid.slice(1,10));
            Session.setPersistent("guestId", gid);
        }
    }

    this.autorun( () => {
        console.log("autorunning learn_share...");

        this.subscription = this.subscribe('userList', Meteor.userId(), {
            onStop: function () {
                console.log("User List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User List subscription ready! ", arguments, this);

                let userList = [];

                User.find().forEach( (user) => {
                    userList.push({
                        text: user.MyProfile.firstName + " " + user.MyProfile.lastName,
                        value: user._id
                    });
                });
            }
        });
        console.log(this.subscription);

        this.subscription2 = this.subscribe('learnShareDetails', this.lssid, {
            onStop: function () {
                console.log("LearnShare List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("LearnShare List subscription ready! ", arguments, this);
                let lssess = LearnShareSession.findOne( {_id: this.params[0]} );
                if (Meteor.user() && "locked" !== lssess.state) {
                    lssess.addParticipantSelf();
                    lssess = LearnShareSession.findOne( {_id: this.params[0]} );
                    let selectControl = $("#select-participants")[0].selectize;
                    for (let i = 0; i < lssess.participants.length; i++) {
                        selectControl.addItem(lssess.participants[i].id);
                    }
                    for (let i = 0; i < lssess.presenters.length; i++) {
                        $(".item[data-value="+lssess.presenters[i].id+"]").addClass("picked");
                    }
                    if ($(".item[data-value]").not(".picked").length === 0) {
                        $("#btn-pick-first").prop("disabled", true);
                    } else {
                        $("#btn-pick-first").prop("disabled", false);
                    }
                } else {
                    lssess.saveGuest(Session.get("guestId"),Session.get("guestName"));
                }
            }
        });
        console.log(this.subscription2);
    });

});

Template.learn_share.onRendered( () => {
    Meteor.setTimeout(() => {
        $('#modal-edit-name').on('shown.bs.modal', function () {
            $('#input-guest-name').focus();
        });
    }, 500);
});

Template.learn_share.helpers({
    userList() {
        let u = User.find().fetch();
        return u;
    },
    canEdit() {
        let lssid = Template.instance().lssid;
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        if (!lssess) {
            return false;
        }
        if (lssess.state === "locked" || !Meteor.user()) {
            return false;
        }
        return true;
    },
    canEditAdmin() {
        let lssid = Template.instance().lssid;
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        if (!lssess) {
            return false;
        }
        if (lssess.state === "locked" || !Roles.userIsInRole(Meteor.userId(), ['admin','learn-share-host'], Roles.GLOBAL_GROUP)) {
            return false;
        }
        return true;
    },
    sessionPresenters() {
        let lssid = Template.instance().lssid;
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        if (!lssess) {
            return [];
        } else {
            return lssess.presenters;
        }
    },
    sessionParticipants() {
        let lssid = Template.instance().lssid;
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        if (!lssess) {
            return [];
        } else {
            return lssess.participants;
        }
    },
    sessionParticipantItems() {
        let lssid = Template.instance().lssid;
        let lssess = LearnShareSession.findOne( {_id:lssid} );

        if (!lssess) {
            return [];
        }

        let participants = lssess.participants;
        let participantIds = [];
        for (let i = 0; i < participants.length; i++) {
            participantIds.push({value: participants[i].id, text: participants[i].name});
        }
        return participantIds;
    },
    roParticipantNames() {
        let lssid = Template.instance().lssid;
        let lssess = LearnShareSession.findOne( {_id:lssid} );

        if (!lssess) {
            return [];
        }

        let participants = lssess.participants;
        let participantList = [];
        for (let i = 0; i < participants.length; i++) {
            participantList.push(participants[i].name);
        }
        return participantList;
    },
    userAddList(teamName) {
        let u = User.find( );
        let addList = [];
        u.forEach((m) => {
            addList.push( {
                value: m._id,
                text: m.MyProfile.firstName + " " + m.MyProfile.lastName
            });
        });
        return addList;
    },
    itemRemoveHandler() {
        return (value, $item) => {
            let numSelected = $("#select-participants")[0].selectize.items.length;
            if (numSelected === 0) {
                $("#btn-pick-first").attr("disabled", true);
            }
            let lssid = $("#select-participants").closest("[data-lssid]").data("lssid");
            let ls = LearnShareSession.findOne( {_id: lssid} );
            if (!ls) {
                return;
            }
            ls.removeParticipant(value);
        }
    },
    itemAddHandler() {
        return (value, $item) => {
            $("#btn-pick-first").prop("disabled",false);
            let participant = {
                id: value,
                name: $item.text().slice(0,-1)
            };
            let id = $item.closest('[data-lssid]').data('lssid');
            let ls = LearnShareSession.findOne( {_id: id} );
            if (!ls) {
                return;
            }
            if (typeof _.find(ls.presenters, function(o) {return o.id===participant.id}) !== "undefined") {
                //if added user is in the list of presenters, mark it
                $item.addClass("picked");
            }
            if ("guest" === participant.id.slice(0,5)) {
                $item.addClass("guest");
            }
            ls.addParticipant(participant);
        }
    },
    order(idx) {
        return idx + 1;
    },
    lssid() {
        return Template.instance().lssid;
    },
    title() {
        let lssid = Template.instance().lssid;
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        if (lssess) {
            return lssess.title;
        }
    },
    sessionActive() {
        let lssid = Template.instance().lssid;
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        if (lssess) {
            if (lssess.state == "locked") {
                return false;
            } else {
                return true;
            }
        }
    },
    notes() {
        let lssid = Template.instance().lssid;
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        if (lssess) {
            return lssess.notes;
        }
    },
    guestName() {
        return Session.get("guestName");
    }
});

var pickRandom = () => {
    let selectControl = $("#select-participants")[0].selectize;

    let availableItems = [];
    for (let i = 0; i < selectControl.items.length; i++) {
        let $item = $(".item[data-value="+selectControl.items[i]+"]");
        if (!$item.hasClass("picked") && !$item.hasClass("picking")) {
            availableItems.push($item);
        }
    }
    if (availableItems.length === 0) {
        //don't pick the same item twice in a row unless it's the last one
        $item = $(".item.picking[data-value]");
        if ($item.length && !$item.hasClass("picked")) {
            availableItems.push($(".item.picking[data-value]"));
        }
    }

    if (availableItems.length <= 1) {
        $("#btn-pick-first").prop("disabled", true);
    }

    if (availableItems.length === 0) {
        //none left to pick
        return '';
    }
    var $picking = availableItems[Math.floor(Math.random()*availableItems.length)];
    $("#p-on-deck-info").data("picking", $picking.data("value"));
    $("#p-on-deck-info").html($picking.text().slice(0,-1));
    $picking.addClass("picking");
    return $picking.data("value");
}
Template.learn_share.events({
    'click button#btn-pick-first'(event, instance) {
        var pickingId = pickRandom();
        if (pickingId !== '') {
            $("#p-on-deck").show();
            $("#p-pick-first").hide();
        }
    },
    'click button#btn-pick-again'(event, instance) {
        let prevPickingId = $("#p-on-deck-info").data("picking");
        var pickingId = pickRandom();

        if (prevPickingId != pickingId) {
            let $prevPicked = $(".item[data-value="+prevPickingId+"]");
            $prevPicked.removeClass("picking");
        }
    },
    'click button#btn-pick-accept'(event, instance) {
        let pickedId = $("#p-on-deck-info").data("picking");
        let picked = {};
        let $pickedItem = $(".item[data-value="+pickedId+"]");
        picked.id = $pickedItem.data("value");
        picked.name = $pickedItem.text().slice(0,-1);
        $pickedItem.removeClass("picking").addClass("picked");
        $("#p-on-deck-info").data("picking","");
        $("#p-on-deck-info").html("");
        $("#p-on-deck").hide();
        $("#p-pick-first").show();
        if ($(".item[data-value]").not(".picked").length === 0) {
            $("#btn-pick-first").attr("disabled", true);
        }

        let lssid = Template.instance().lssid;
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        lssess.addPresenter(picked);
    },
    'keypress #input-notes,#input-title'(event, instance) {
        if (!Roles.userIsInRole(Meteor.userId(), ['admin','learn-share-host'], Roles.GLOBAL_GROUP)) {
            event.preventDefault();
        }
    },
    'keyup #input-notes,#input-title':_.debounce(function (event, instance) {
        if (Roles.userIsInRole(Meteor.userId(), ['admin','learn-share-host'], Roles.GLOBAL_GROUP)) {
            let lssid = $(".container[data-lssid]").data("lssid");
            let lssess = LearnShareSession.findOne( {_id:lssid} );
            lssess.saveText($("#input-title").val(), $("#input-notes").val());
        }
    }, 2000),
    'click button#modal-save-name'(event, instance) {
        let lssid = $(".container[data-lssid]").data("lssid");
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        let guestName = $("#input-guest-name").val();
        Session.setPersistent("guestName",guestName);
        lssess.saveGuest(Session.get("guestId"), guestName);
        $("#modal-edit-name").modal("hide");
    },
    'click a#lockSession'(event,instance) {
        event.preventDefault();
        let lssid = $(".container[data-lssid]").data("lssid");
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        lssess.lockSession();
    },
    'click a#unlockSession'(event,instance) {
        event.preventDefault();
        if (Roles.userIsInRole(Meteor.userId(), ['admin','learn-share-host'], Roles.GLOBAL_GROUP)) {
            let lssid = $(".container[data-lssid]").data("lssid");
            let lssess = LearnShareSession.findOne( {_id:lssid} );
            lssess.unlockSession();
        }
    },
});
