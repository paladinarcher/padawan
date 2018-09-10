import { User } from '/imports/api/users/users.js';
import { LearnShareSession } from '/imports/api/learn_share/learn_share.js';
import { Team } from '/imports/api/teams/teams.js';
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

var app;
var client_id = '8e7e8c57-117c-454a-bf71-7ec493ab82b1';
var meeting;
var version = "appdeveloperlevel/0.59";

function initSkypeAPI() {
    console.log(sessionStorage);
    debugger;
    var hasToken = /^#access_token=/.test(location.hash) || !!sessionStorage.apiAccessToken;
    var hasError = /^#error=/.test(location.hash);
    if (!hasToken && !hasError) {
        let pathParts = location.pathname.split('/');
        sessionStorage.lastLearnShareId = pathParts[pathParts.length-1];
        console.log(sessionStorage);
        location.assign('https://login.microsoftonline.com/common/oauth2/authorize?response_type=token' +
            '&client_id=' + client_id +
            '&redirect_uri=' + location.origin + '/learnShare' +
            '&resource=https://webdir.online.lync.com');
    } else {
        if (!sessionStorage.apiAccessToken) {
            var tokenresponse = parseHashParams(window.location.hash);
            sessionStorage.apiAccessToken = tokenresponse.access_token;
            window.location.hash = '#';
        }
        Skype.initialize(
            {
                apiKey: 'a42fcebd-5b43-4b89-a065-74450fb91255',
                correlationIds: {
                    sessionId: 'mySession123', // Necessary for troubleshooting requests, should be unique per session
                }
            },
            function (api) {
                console.log("wwwwwwwwwwwwwwwwwwwwwww");
                app = new api.application();
                console.log(app);
                apiSignIn();
            }
        );
    }
}
function parseHashParams(hash) {
    var params = hash.slice(1).split('&');

    var paramarray = {};
    params.forEach(function(param) {
        param = param.split('=');
        paramarray[param[0]] = param[1];
    });

    return paramarray;
}
function apiSignIn() {
    var application = app;
    // the SDK will get its own access token
    app.signInManager.signIn({
        client_id: client_id,
        cors: true,
        redirect_uri: '/learnShare',
        origins: [ "https://webdir.online.lync.com/autodiscover/autodiscoverservice.svc/root" ],
        version: version // Necessary for troubleshooting requests; identifies your application in our telemetry
    }).then(
        function(a) {
            console.log("signed in", a);
            createMeeting();
        },
        function(err) {
            $("#span-create-skype").html("(<a href='#' id='a-create-call'>Create skype meeting</a>)");
            console.log("sign in error", err);
        }
    )
}
function createMeeting() {
    meeting = app.conversationsManager.createMeeting();
    meeting.subject('LearnShare Meeting');
    meeting.accessLevel('Everyone');
    meeting.onlineMeetingUri.get().then(
        function(uri) {
            //var conversation = app.conversationsManager.getConversationByUri(uri);
            let uriChunks = uri.split(':');
            let skypeUser = uriChunks[1].split(';')[0];
            let emlUser = skypeUser.split('@')[0];
            let emlDomain = skypeUser.split('@')[1];
            let mtgId = uriChunks[uriChunks.length-1];
            let url = 'https://meet.lync.com/'+emlDomain+'/'+emlUser+'/'+mtgId;
            $("#input-skype-url").val(url);
            $("#span-create-skype").html("(<a href='#' id='a-create-call'>Create skype meeting</a>)");
            $("#input-skype-url").trigger("change");
        },
        function(err) {
            $("#span-create-skype").html("(<a href='#' id='a-create-call'>Create skype meeting</a>)");
        }
    );
}

Template.learn_share.onCreated(function () {
    this.lssid = FlowRouter.getParam('lssid');
    if (!Meteor.user()) {
        //user not logged in, treat as guest
        let gname = Session.get("guestName");
        if ("undefined" === typeof gname) {
            let gid = generateGuestId();
            //Session.setPersistent("guestName", 'lurker'+gid.slice(5,10));
            //Session.setPersistent("guestId", gid);
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
                if ("locked" !== lssess.state) {
                    if (Meteor.user()) {
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
                        lssess.saveGuest( {'id':Session.get("guestId"),'name':Session.get("guestName")} );
                    }
                }
            }
        });
        console.log(this.subscription2);

        this.subscription3 = this.subscribe('teamsData', Meteor.userId(), {
            onStop: function () {
                console.log("teamsData subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("teamsData subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription3);
    });

});

Template.learn_share.onRendered( () => {
    Meteor.setTimeout(() => {
        if (/^#access_token=/.test(location.hash)) {
            $("#a-skype-url-edit").trigger("click");
            Meteor.setTimeout(() => {
                $("#a-create-call").trigger("click");
            }, 500);
        }
        $('#modal-edit-name').on('shown.bs.modal', function () {
            $('#input-guest-name').focus();
        });
        $(document).on('click','#selectize-outer-select-guests .selectize-input .item', function (event) {
            let $target = $(event.target);
            let participant = {
                id: $target.data("value"),
                name: $target.text().slice(0,-1)
            };
            let lssid = $("#select-participants").closest("[data-lssid]").data("lssid");
            let ls = LearnShareSession.findOne( {_id: lssid} );
            if (!ls) {
                return;
            }
            ls.removeGuest(participant.id, () => {
                let ls2 = LearnShareSession.findOne( {_id: lssid} );
                ls2.addParticipant(participant);
            });
        });
        $(document).on('click','#selectize-outer-select-participants .selectize-input .item', function (event) {
            let $target = $(event.target);
            let participant = {
                id: $target.data("value"),
                name: $target.text().slice(0,-1)
            };
            let lssid = $("#select-participants").closest("[data-lssid]").data("lssid");
            let ls = LearnShareSession.findOne( {_id: lssid} );
            if (!ls) {
                return;
            }
            ls.removeGuest(participant.id, () => {
                let ls2 = LearnShareSession.findOne( {_id: lssid} );
                ls2.addParticipant(participant);
            });
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
    sessionGuests() {
        let lssid = Template.instance().lssid;
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        if (!lssess) {
            return [];
        } else {
            return lssess.guests;
        }
    },
    sessionGuestItems() {
        let lssid = Template.instance().lssid;
        let lssess = LearnShareSession.findOne( {_id:lssid} );

        if (!lssess) {
            return [];
        }

        let guests = lssess.guests;
        let guestIds = [];
        for (let i = 0; i < guests.length; i++) {
            guestIds.push({value: guests[i].id, text: guests[i].name});
        }
        return guestIds;
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
    itemRemoveGuestHandler() {
        return (value, $item) => {
            let lssid = $("#select-guests").closest("[data-lssid]").data("lssid");
            let ls = LearnShareSession.findOne( {_id: lssid} );
            if (!ls) {
                return;
            }
            ls.removeGuest(value);
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
    itemAddGuestHandler() {
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
            ls.saveGuest(participant);
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
    teamId() {
        let lssid = Template.instance().lssid;
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        if (lssess) {
            return lssess.teamId;
        } else {
            return "";
        }
    },
    team() {
        let lssid = Template.instance().lssid;
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        if (lssess) {
            return Team.findOne( {_id:lssess.teamId} );
        } else {
            return "";
        }
    },
    teamName() {
        let lssid = Template.instance().lssid;
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        if (lssess) {
            return Team.findOne( {_id:lssess.teamId} ).Name;
        } else {
            return "";
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
    skypeUrl() {
        let lssid = Template.instance().lssid;
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        if (lssess) {
            return lssess.skypeUrl;
        }
    },
    guestName() {
        return Session.get("guestName").split('-')[1];
    }
});

var pickRandom = () => {
    let selectControl = $("#select-participants")[0].selectize;

    let availableItems = [];
    for (let i = 0; i < selectControl.items.length; i++) {
        let $item = $(".item[data-value="+selectControl.items[i]+"]");
        if (!$item.hasClass("picked") && !$item.hasClass("picking") && !$item.hasClass("guestList")) {
            availableItems.push($item);
        }
    }
    if (availableItems.length === 0) {
        //don't pick the same item twice in a row unless it's the last one
        $item = $(".item.picking[data-value]");
        if ($item.length && !$item.hasClass("picked") && !$item.hasClass("guestList")) {
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
    'change .file-upload-input'(event, instance) {
        var file = event.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function(fileLoadEvent) {
            let lssid = $(".container[data-lssid]").data("lssid");
            let lssess = LearnShareSession.findOne( {_id:lssid} );
            lssess.uploadRecording(file, reader.result);
        };
        reader.readAsBinaryString(file);
    },
    'click button#btn-pick-first'(event, instance) {
        let lssid = $(".container[data-lssid]").data("lssid");
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        lssess.uniqueParticipants();
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
        let lssid = $(".container[data-lssid]").data("lssid");
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        lssess.uniqueParticipants();
    },
    'click button#btn-pick-accept'(event, instance) {
        let lssid = $(".container[data-lssid]").data("lssid");
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        lssess.uniqueParticipants();
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

        lssid = Template.instance().lssid;
        lssess = LearnShareSession.findOne( {_id:lssid} );
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
        let guestName = "guest-"+$("#input-guest-name").val();
        Session.setPersistent("guestName",guestName);
        lssess.saveGuest( {'id':Session.get("guestId"), 'name':guestName} );
        $("#modal-edit-name").modal("hide");
    },
    'click a#lockSession'(event,instance) {
        event.preventDefault();
        let lssid = $(".container[data-lssid]").data("lssid");
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        lssess.saveText($("#input-title").val(), $("#input-notes").val());
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
    'click a#a-skype-url-edit'(event,instance) {
        event.preventDefault();
        if (Roles.userIsInRole(Meteor.userId(), ['admin','learn-share-host'], Roles.GLOBAL_GROUP)) {
            $("#a-skype-url").hide();
            $("#a-skype-url-edit").hide();
            $("#input-skype-url").show();
            $("#span-create-skype").show();
        }
    },
    'click a#a-create-call'(event,instance) {
        event.preventDefault();
        $("#span-create-skype").html("<img src='/img/loading.gif' style='height:20px;width:20px;' /><span style='font-size:xx-small;'>contacting Skype</span>")
        initSkypeAPI();
    },
    'change input#input-skype-url'(event,instance) {
        let lssid = $(".container[data-lssid]").data("lssid");
        let lssess = LearnShareSession.findOne( {_id:lssid} );
        lssess.setSkypeUrl($("#input-skype-url").val());
        $("#a-skype-url").show();
        $("#a-skype-url-edit").show();
        $("#input-skype-url").hide();
        $("#span-create-skype").hide();
    }
});
