import { User } from '/imports/api/users/users.js';
import { LearnShareSession } from '/imports/api/learn_share/learn_share.js';
import { Team } from '/imports/api/teams/teams.js';
import { Timer } from '/imports/api/timer/timer.js';
import './learn_share.html';
import '/imports/ui/components/label_list/label_list.js';
import { ReactiveDict } from 'meteor/reactive-dict';

var generateGuestId = () => {
  var text = 'guest-';
  var idLength = 11;
  var possible = 'acdeghijklmnopqrstuvwxyzACDEGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (var i = 0; i < idLength; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

var app;
var client_id = '8e7e8c57-117c-454a-bf71-7ec493ab82b1';
var meeting;
var version = 'appdeveloperlevel/0.59';

let lsData = new ReactiveDict();

function initSkypeAPI() {
  console.log(sessionStorage);
  debugger;
  var hasToken =
    /^#access_token=/.test(location.hash) || !!sessionStorage.apiAccessToken;
  var hasError = /^#error=/.test(location.hash);
  if (!hasToken && !hasError) {
    let pathParts = location.pathname.split('/');
    sessionStorage.lastLearnShareId = pathParts[pathParts.length - 1];
    console.log(sessionStorage);
    location.assign(
      'https://login.microsoftonline.com/common/oauth2/authorize?response_type=token' +
        '&client_id=' +
        client_id +
        '&redirect_uri=' +
        location.origin +
        '/learnShare' +
        '&resource=https://webdir.online.lync.com'
    );
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
          sessionId: 'mySession123' // Necessary for troubleshooting requests, should be unique per session
        }
      },
      function(api) {
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
  app.signInManager
    .signIn({
      client_id: client_id,
      cors: true,
      redirect_uri: '/learnShare',
      origins: [
        'https://webdir.online.lync.com/autodiscover/autodiscoverservice.svc/root'
      ],
      version: version // Necessary for troubleshooting requests; identifies your application in our telemetry
    })
    .then(
      function(a) {
        console.log('signed in', a);
        createMeeting();
      },
      function(err) {
        $('#span-create-skype').html(
          "(<a href='#' id='a-create-call'>Create skype meeting</a>)"
        );
        console.log('sign in error', err);
      }
    );
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
      let mtgId = uriChunks[uriChunks.length - 1];
      let url =
        'https://meet.lync.com/' + emlDomain + '/' + emlUser + '/' + mtgId;
      $('#input-skype-url').val(url);
      $('#span-create-skype').html(
        "(<a href='#' id='a-create-call'>Create skype meeting</a>)"
      );
      $('#input-skype-url').trigger('change');
    },
    function(err) {
      $('#span-create-skype').html(
        "(<a href='#' id='a-create-call'>Create skype meeting</a>)"
      );
    }
  );
}

function timeallotment(){
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });
    let allotted = $('#allotted');

    // participant list
    if (!lssess) {
      return [];
    }
    let participants = lssess.participants;
    let participantIds = [];
    for (let i = 0; i < participants.length; i++) {
      participantIds.push({
        value: participants[i].id,
        text: participants[i].name
      });
    }
    participantList = participantIds.length;

    // Presenter list
    presenterList = lssess.presenters.length;

    // Selecting countdown timer
    let countdownTimer = $('#countdownTimer');
    let cdMin = parseInt(countdownTimer['0'].innerText.split(':')[0])*60; // cd minutes
    let cdSec = parseInt(countdownTimer['0'].innerText.split(':')[1]); // cd seconds
    let cdTimer = (cdMin + cdSec)/60; 
    
    // Math
    let calc = (pl)=> {
      let numb = cdTimer / pl; // time allotted to remaining presenters
      numb = numb.toFixed(2); // need to get two decimal places
      let aMin = numb.split('.')[0]; // allotted time minutes
      aMin = ('0' + aMin).slice(-2); // adding a leading zero
      let aSec = numb.split('.')[1] / 100; // allotted time seconds
      aSec = ('0' + Math.round(aSec * 60)).slice(-2); // adding a leading zero
      let allottedTimer = aMin + ' : ' + aSec;
      return allotted.html(allottedTimer);
    }

    if (presenterList === 0){
      let presentersLeft = parseInt(participantList - presenterList); //remaining presenters
      return calc(presentersLeft);
    } else {
      let presentersLeft = parseInt(participantList - presenterList)+1; //remaining presenters
      return calc(presentersLeft);
    }
}

function playPresenterTimer() {
    let lssid = $(".container[data-lssid]").data("lssid");
    Meteor.call('timer.pPlay',lssid);

    // allotted timer adjust
    timeallotment();

    // button controls
    $('#pausePTimer').show();
    $('#playPTimer').hide();
    $('#resetPTimer').hide(); 
}

function resetPresenterTimer() {
    let lssid = $(".container[data-lssid]").data("lssid");
    let lssess = LearnShareSession.findOne( {_id:lssid} );
    let presenters = lssess.presenters;
    let participantIds = [];
    for (let i = 0; i < presenters.length; i++) {
        participantIds.push({value: presenters[i].id, text: presenters[i].name});
    }
    let presenterId = participantIds.pop().value;

    Meteor.call('timer.pReset', lssid);
    let sessionLength = 100;
    Meteor.call('timer.create',lssid,presenterId,parseInt(sessionLength)*60); 

    // allotted timer adjust
    //timeallotment();

    // button controls
    $('#pausePTimer').show();
    $('#playPTimer').hide();
    $('#resetPTimer').hide();
}

function stopPresenterTimer() {
    let lssid = $(".container[data-lssid]").data("lssid");
    Meteor.call('timer.stop',lssid);

    // allotted timer adjust
    //timeallotment();
    
    // button controls
    $('#pausePTimer').hide();
    $('#playPTimer').css('display', 'inline');
    $('#resetPTimer').css('display', 'inline');
    
}

Template.learn_share.onCreated(function() {
  this.lssid = FlowRouter.getParam('lssid');

  if (!Meteor.user()) {
    //user not logged in, treat as guest
    let gname = Session.get('guestName');
    if ('undefined' === typeof gname) {
      let gid = generateGuestId();
      Session.setPersistent('guestName', 'lurker' + gid.slice(5, 10));
      Session.setPersistent('guestId', gid);
    }
  }

  this.autorun(() => {
    console.log('autorunning learn_share...');

    this.subscription = this.subscribe('userList', Meteor.userId(), {
      onStop: function() {
        console.log('User List subscription stopped! ', arguments, this);
      },
      onReady: function() {
        console.log('User List subscription ready! ', arguments, this);

        let userList = [];

        User.find().forEach(user => {
          userList.push({
            text: user.MyProfile.firstName + ' ' + user.MyProfile.lastName,
            value: user._id
          });
        });
      }
    });
    console.log(this.subscription);

    this.subscription2 = this.subscribe('learnShareDetails', this.lssid, {
      onStop: function() {
        console.log('LearnShare List subscription stopped! ', arguments, this);
      },
      onReady: function() {
        console.log('LearnShare List subscription ready! ', arguments, this);
      }
    });
    console.log(this.subscription2);

    this.subscription3 = this.subscribe('teamsData', Meteor.userId(), {
      onStop: function() {
        console.log('teamsData subscription stopped! ', arguments, this);
      },
      onReady: function() {
        console.log('teamsData subscription ready! ', arguments, this);
      }
    });
    console.log(this.subscription3);

    this.subscription4 = this.subscribe('teamsMemberOfList', Meteor.userId(), {
      onStop: function() {
        console.log(
          'Team Member Of List subscription stopped! ',
          arguments,
          this
        );
      },
      onReady: function() {
        console.log(
          'Team Member Of List subscription ready! ',
          arguments,
          this
        );
      }
    });

    this.timerSubcription = this.subscribe('timersData', this.lssid, {
      onStop: function() {
        console.log(
          'TimersData stop! ',
          arguments,
          this
        );
      },
      onReady: function() {
        console.log(
          'timersData Ready',
          arguments,
          this
        );
      }
    });
  });
});

Template.learn_share.onRendered(() => {
  Meteor.setTimeout(() => {
    noTeamOption = document.evaluate('//select[@id="select-team1"]/option[text()="No Team"]', document);
    noTeamOption = $('#select-team1').find('option[text="No Team"]')
    noTeamOption.attr("selected", "");
  }, 5000);
  
  Meteor.setTimeout(() => {

    if (/^#access_token=/.test(location.hash)) {
      $('#a-skype-url-edit').trigger('click');
      Meteor.setTimeout(() => {
        $('#a-create-call').trigger('click');
      }, 500);
    }

    let lssid = $('.container[data-lssid]').data('lssid');
    let timeId = Timer.findOne({
      learnShareSessionId: lssid,
      presenterId: 'countdown'
    });
    let lssess = LearnShareSession.findOne({
      _id: lssid
    });
    if (lssess !== undefined && 'locked' !== lssess.state) {
      if (Meteor.user()) {
        lssess.addParticipantSelf();
        lssess = LearnShareSession.findOne({
          _id: lssid
        });
        let selectControl = $('#select-participants')[0].selectize;
        for (let i = 0; i < lssess.participants.length; i++) {
          selectControl.addItem(lssess.participants[i].id);
        }
        for (let i = 0; i < lssess.presenters.length; i++) {
          $('.item[data-value=' + lssess.presenters[i].id + ']').addClass(
            'picked'
          );
        }
        if ($('.item[data-value]').not('.picked').length === 0) {
          $('#btn-pick-first').prop('disabled', true);
        } else {
          $('#btn-pick-first').prop('disabled', false);
        }
      } else {
        lssess.saveGuest({
          id: Session.get('guestId'),
          name: Session.get('guestName')
        });
      }
    }

    if (timeId != null) {
      this.$('#pausetimerbtn').hide();
      this.$('#playtimerbtn').css('display', 'inline');

      // hide start session and time input field
      this.$('.guestList').hide();

      // displays player controls
      this.$('#player-control').css('display', 'inline');
    }

    $('#modal-edit-name').on('shown.bs.modal', function() {
      $('#input-guest-name').focus();
    });
    $(document).on(
      'click',
      '#selectize-outer-select-guests .selectize-input .item',
      function(event) {
        let $target = $(event.target);
        let participant = {
          id: $target.data('value'),
          name: $target.text().slice(0, -1)
        };
        let lssid = $('#select-participants')
          .closest('[data-lssid]')
          .data('lssid');
        let ls = LearnShareSession.findOne({ _id: lssid });
        if (!ls) {
          return;
        }
        ls.removeGuest(participant.id, () => {
          let ls2 = LearnShareSession.findOne({ _id: lssid });
          ls2.addParticipant(participant);
        });
      }
    );
    $(document).on(
      'click',
      '#selectize-outer-select-participants .selectize-input .item',
      function(event) {
        let $target = $(event.target);
        let participant = {
          id: $target.data('value'),
          name: $target.text().slice(0, -1)
        };
        let lssid = $('#select-participants')
          .closest('[data-lssid]')
          .data('lssid');
        let ls = LearnShareSession.findOne({ _id: lssid });
        if (!ls) {
          return;
        }
        ls.removeGuest(participant.id, () => {
          let ls2 = LearnShareSession.findOne({ _id: lssid });
          ls2.addParticipant(participant);
        });
      }
    );
    
  }, 500);
});

Template.learn_share.onDestroyed(() => {
  let lssid = $('.container[data-lssid]').data('lssid');
  Meteor.call('timer.pause', lssid);
});


/* 
*  Learn Share Helpers
*/
Template.learn_share.helpers({
  userList() {
    let u = User.find().fetch();
    return u;
  },
  isHost() {
    if (Meteor.user().roles.__global_roles__) {
      let isAdmin = Meteor.user().roles.__global_roles__.filter(
        role => role === 'admin'
      );
      if (isAdmin.length > 0) {
        return true;
      }
    }
    return false;
  },
  canEdit() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });
    if (!lssess) {
      return false;
    }
    if (lssess.state === 'locked' || !Meteor.user()) {
      return false;
    }
    return true;
  },
  canEditAdmin() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });

    if (!lssess) {
      return false;
    }

    let team = Team.findOne({ _id: lssess.teamId });

    if (!team) {
      return false;
    }

    if (lssess.state === 'locked') {
      return false;
    } else if (
      !Roles.userIsInRole(
        Meteor.userId(),
        ['admin', 'learn-share-host'],
        Roles.GLOBAL_GROUP
      ) &&
      !Roles.userIsInRole(
        Meteor.userId(),
        ['admin', 'learn-share-host'],
        team.Name
      )
    ) {
      return false;
    }
    return true;
  },
  sessionCountdown() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });
    if (!lssess) {
      return [];
    } else {
      let countdown = { name: 'countdown', id: 'countdown' };
      return countdown;
    }
  },
  sessionPresenters() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });
    if (!lssess) {
      return [];
    } else {
      return lssess.presenters;
    }
  },
  sessionNextParticipant() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });

    if (!lssess) {
      return [];
    } else {
      return lssess.nextParticipant;
    }
  },
  sessionParticipants() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });
    if (!lssess) {
      return [];
    } else {
      return lssess.participants;
    }
  },
  sessionParticipantItems() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });

    if (!lssess) {
      return [];
    }

    let participants = lssess.participants;
    let participantIds = [];
    for (let i = 0; i < participants.length; i++) {
      participantIds.push({
        value: participants[i].id,
        text: participants[i].name
      });
    }
    return participantIds;
  },
  sessionGuests() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });
    if (!lssess) {
      return [];
    } else {
      return lssess.guests;
    }
  },
  sessionGuestItems() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });

    if (!lssess) {
      return [];
    }

    let guests = lssess.guests;
    let guestIds = [];
    for (let i = 0; i < guests.length; i++) {
      guestIds.push({ value: guests[i].id, text: guests[i].name });
    }
    return guestIds;
  },
  roParticipantNames() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });

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
    let u = User.find();
    let addList = [];
    u.forEach(m => {
      addList.push({
        value: m._id,
        text: m.MyProfile.firstName + ' ' + m.MyProfile.lastName
      });
    });
    return addList;
  },
  itemRemoveHandler() {
    return (value, $item) => {
      let numSelected = $('#select-participants')[0].selectize.items.length;
      if (numSelected === 0) {
        $('#btn-pick-first').attr('disabled', true);
      }
      let lssid = $('#select-participants')
        .closest('[data-lssid]')
        .data('lssid');
      let ls = LearnShareSession.findOne({ _id: lssid });
      if (!ls) {
        return;
      }
      ls.removeParticipant(value);
    };
  },
  itemRemoveGuestHandler() {
    return (value, $item) => {
      let lssid = $('#select-guests')
        .closest('[data-lssid]')
        .data('lssid');
      let ls = LearnShareSession.findOne({ _id: lssid });
      if (!ls) {
        return;
      }
      ls.removeGuest(value);
    };
  },
  itemAddHandler() {
    return (value, $item) => {
      $('#btn-pick-first').prop('disabled', false);
      let participant = {
        id: value,
        name: $item.text().slice(0, -1)
      };
      let id = $item.closest('[data-lssid]').data('lssid');
      let ls = LearnShareSession.findOne({ _id: id });
      if (!ls) {
        return;
      }
      if (
        typeof _.find(ls.presenters, function(o) {
          return o.id === participant.id;
        }) !== 'undefined'
      ) {
        //if added user is in the list of presenters, mark it
        $item.addClass('picked');
      }
      if ('guest' === participant.id.slice(0, 5)) {
        $item.addClass('guest');
      }
      ls.addParticipant(participant);
    };
  },
  itemAddGuestHandler() {
    return (value, $item) => {
      $('#btn-pick-first').prop('disabled', false);
      let participant = {
        id: value,
        name: $item.text().slice(0, -1)
      };
      let id = $item.closest('[data-lssid]').data('lssid');
      let ls = LearnShareSession.findOne({ _id: id });
      if (!ls) {
        return;
      }
      if (
        typeof _.find(ls.presenters, function(o) {
          return o.id === participant.id;
        }) !== 'undefined'
      ) {
        //if added user is in the list of presenters, mark it
        $item.addClass('picked');
      }
      if ('guest' === participant.id.slice(0, 5)) {
        $item.addClass('guest');
      }
      ls.saveGuest(participant);
    };
  },
  order(idx) {
    return idx + 1;
  },
  lssid() {
    return Template.instance().lssid;
  },
  title() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });
    if (lssess) {
      return lssess.title;
    }
  },
  // adding teams to active learn share
  teamList() {
    //list of teams the user is a member of
    let t = Team.find({ Members: Meteor.userId() });
    if (!t) {
      return [];
    }
    let lst = t.fetch();

    return lst;
  },
  teamSelected(learnShareName) {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });
    let thisTeam = Team.findOne({ _id: lssess.teamId })
    if (thisTeam) {
      if (learnShareName === thisTeam.Name) {
        return 'selected';
      }
    }
    else if(learnShareName === 'No Team') {
      let selectedTeam = $('#select-team1');
      console.log("selectedTeam val: ", selectedTeam.val());
      lssess.setTeam(selectedTeam.val());
      return 'selected';
    }
    
  },
  teamId() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });
    if (lssess) {
      return lssess.teamId;
    } else {
      return '';
    }
  },
  team() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });
    if (lssess) {
      return Team.findOne({ _id: lssess.teamId });
    } else {
      return '';
    }
  },
  teamName() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });
    if (lssess) {
      return Team.findOne({ _id: lssess.teamId }).Name;
    } else {
      return '';
    }
  },
  sessionActive() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });
    if (lssess) {
      if (lssess.state == 'locked') {
        return false;
      } else {
        return true;
      }
    }
  },
  notes() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });
    if (lssess) {
      return lssess.notes;
    }
  },
  skypeUrl() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });
    if (lssess) {
      return lssess.skypeUrl;
    }
  },
  guestName() {
    return Session.get('guestName').split('-')[1];
  },
  enableNotesText() {
    let lssid = Template.instance().lssid;
    let lssess = LearnShareSession.findOne({ _id: lssid });
    if (lssess && lssess.notesEnabled()) {
      return 'Disable Notes For All Participants';
    } else {
      return 'Enable Notes For All Participants';
    }
  },
  remainingTime () {
    return Timer.find({presenterId: 'countdown'}).fetch()[0].remainingTime
  },
});  //  End LearnShare Helpers

var pickRandom = () => {
  let selectControl = $('#select-participants')[0].selectize;

  let availableItems = [];
  for (let i = 0; i < selectControl.items.length; i++) {
    let $item = $('.item[data-value=' + selectControl.items[i] + ']');
    if (
      !$item.hasClass('picked') &&
      !$item.hasClass('picking') &&
      !$item.hasClass('guestList')
    ) {
      availableItems.push($item);
    }
  }
  if (availableItems.length === 0) {
    //don't pick the same item twice in a row unless it's the last one
    $item = $('.item.picking[data-value]');
    if (
      $item.length &&
      !$item.hasClass('picked') &&
      !$countdowncountdowncountdowncountdowncountdownitem.hasClass('guestList')
    ) {
      availableItems.push($('.item.picking[data-value]'));
    }
  }

  if (availableItems.length <= 1) {
    $('#btn-pick-first').prop('disabled', true);
  }

  if (availableItems.length === 0) {
    //none left to pick
    return '';
  }
  var $picking =
    availableItems[Math.floor(Math.random() * availableItems.length)];
  $('#p-on-deck-info').data('picking', $picking.data('value'));
  $('#p-on-deck-info').html($picking.text().slice(0, -1));
  $picking.addClass('picking');
  return $picking.data('value');
};


/**
 * LearnShare Template Events
 */
Template.learn_share.events({
  'change .file-upload-input'(event, instance) {
    var file = event.currentTarget.files[0];
    var reader = new FileReader();
    reader.onload = function(fileLoadEvent) {
      let lssid = $('.container[data-lssid]').data('lssid');
      let lssess = LearnShareSession.findOne({ _id: lssid });
      lssess.uploadRecording(file, reader.result);
    };
    reader.readAsBinaryString(file);
  },
  'click button#btn-pick-first'(event, instance) {
    let lssid = $('.container[data-lssid]').data('lssid');
    let lssess = LearnShareSession.findOne({ _id: lssid });
    lssess.uniqueParticipants();
    var pickingId = pickRandom();

    if (pickingId !== '') {
      // Set the next presenter on the group session for all to see.
      lssess.setNextParticipant(pickingId);
      $('#p-on-deck').show();
      $('#p-pick-first').hide();
    }
  },
  'click button#btn-pick-again'(event, instance) {
    let prevPickingId = $('#p-on-deck-info').data('picking');
    var pickingId = pickRandom();

    if (prevPickingId != pickingId) {
      let $prevPicked = $('.item[data-value=' + prevPickingId + ']');
      $prevPicked.removeClass('picking');
    }
    let lssid = $('.container[data-lssid]').data('lssid');
    let lssess = LearnShareSession.findOne({ _id: lssid });
    lssess.uniqueParticipants();
    // Set the next presenter on the group session for all to see.
    console.log('next', lssess.nextPresenter);
    lssess.setNextParticipant(pickingId);
  },
  'click button#btn-pick-accept'(event, instance) {
    let lssid = $('.container[data-lssid]').data('lssid');
    let lssess = LearnShareSession.findOne({ _id: lssid });
    lssess.uniqueParticipants();
    let pickedId = $('#p-on-deck-info').data('picking');
    let picked = {};
    let $pickedItem = $('.item[data-value=' + pickedId + ']');
    picked.id = $pickedItem.data('value');
    picked.name = $pickedItem.text().slice(0, -1);
    lssess.setNextParticipant('');
    $pickedItem.removeClass('picking').addClass('picked');
    $('#p-on-deck-info').data('picking', '');
    $('#p-on-deck-info').html('');
    $('#p-on-deck').hide();
    $('#p-pick-first').show();
    if ($('.item[data-value]').not('.picked').length === 0) {
      $('#btn-pick-first').attr('disabled', true);
    }

    // presenter timer
    lssid = Template.instance().lssid;
    lssess = LearnShareSession.findOne({ _id: lssid });
    lssess.addPresenter(picked);
    $('#pausePTimer').css('display', 'inline');
    $('#playPTimer').hide();
    $('#resetPTimer').hide();

    let sessionLength = 100;
    Meteor.call('timer.create', lssid, picked.id, parseInt(sessionLength) * 60);

    timeallotment();

  },
  'keypress #input-notes,#input-title'(event, instance) {
    let lssid = $('.container[data-lssid]').data('lssid');
    let lssess = LearnShareSession.findOne({ _id: lssid });

    if (!lssess) {
      return;
    }

    let team = Team.findOne({ _id: lssess.teamId });

    if (!team) {
      return;
    }

    if (
      !Roles.userIsInRole(
        Meteor.userId(),
        ['admin', 'learn-share-host'],
        Roles.GLOBAL_GROUP
      ) &&
      !Roles.userIsInRole(
        Meteor.userId(),
        ['admin', 'learn-share-host'],
        team.Name
      ) &&
      !lssess.notesEnabled()
    ) {
      event.preventDefault();
    }
  },
  'keyup #input-notes,#input-title': _.debounce(function(event, instance) {
    let lssid = $('.container[data-lssid]').data('lssid');
    let lssess = LearnShareSession.findOne({ _id: lssid });

    if (!lssess) {
      return;
    }

    let team = Team.findOne({ _id: lssess.teamId });

    if (!team) {
      return;
    }

    if (
      !Roles.userIsInRole(
        Meteor.userId(),
        ['admin', 'learn-share-host'],
        Roles.GLOBAL_GROUP
      ) ||
      !Roles.userIsInRole(
        Meteor.userId(),
        ['admin', 'learn-share-host'],
        team.Name
      ) ||
      lssess.notesEnabled()
    ) {
      lssess.saveText($('#input-title').val(), $('#input-notes').val());
    }
  }, 2000),
  'click button#btn-enable-notes'(event, instance) {
    let lssid = $('.container[data-lssid]').data('lssid');
    let lssess = LearnShareSession.findOne({ _id: lssid });

    if (!lssess) {
      return;
    }

    if (lssess.notesEnabled()) {
      lssess.enableNotes(false);
    } else {
      lssess.enableNotes(true);
    }
  },
  'click button#modal-save-name'(event, instance) {
    let lssid = $('.container[data-lssid]').data('lssid');
    let lssess = LearnShareSession.findOne({ _id: lssid });
    let guestName = 'guest-' + $('#input-guest-name').val();
    console.log('LSSID: ', lssid, 'LSSESS: ', lssess, 'guestName: ', guestName);
    Session.setPersistent('guestName', guestName);
    console.log('guestId', Session.get('guestId'), 'guestName', guestName);
    lssess.saveGuest({ id: Session.get('guestId'), name: guestName });
    $('#modal-edit-name').modal('hide');
  },
  'click a#lockSession'(event, instance) {
    event.preventDefault();
    let lssid = $('.container[data-lssid]').data('lssid');
    let lssess = LearnShareSession.findOne({ _id: lssid });
    lssess.saveText($('#input-title').val(), $('#input-notes').val());
    lssess.lockSession();
    Meteor.call('timer.stop', lssid);
    Meteor.call('timer.cdstop', lssid);
    $('#timerbtn').hide();
  },
  'click a#unlockSession'(event, instance) {
    event.preventDefault();
    if (
      Roles.userIsInRole(
        Meteor.userId(),
        ['admin', 'learn-share-host'],
        Roles.GLOBAL_GROUP
      )
    ) {
      let lssid = $('.container[data-lssid]').data('lssid');
      let lssess = LearnShareSession.findOne({ _id: lssid });
      lssess.unlockSession();
      $('#timerbtn').show();
    }
  },

  'click a#a-skype-url-edit'(event, instance) {
    event.preventDefault();
    if (
      Roles.userIsInRole(
        Meteor.userId(),
        ['admin', 'learn-share-host'],
        Roles.GLOBAL_GROUP
      )
    ) {
      $('#a-skype-url').hide();
      $('#a-skype-url-edit').hide();
      $('#input-skype-url').show();
      $('#span-create-skype').show();
    }
  },
  'click a#a-create-call'(event, instance) {
    event.preventDefault();
    $('#span-create-skype').html(
      "<img src='/img/loading.gif' style='height:20px;width:20px;' /><span style='font-size:xx-small;'>contacting Skype</span>"
    );
    initSkypeAPI();
  },
  'change input#input-skype-url'(event, instance) {
    let lssid = $('.container[data-lssid]').data('lssid');
    let lssess = LearnShareSession.findOne({ _id: lssid });
    lssess.setSkypeUrl($('#input-skype-url').val());
    $('#a-skype-url').show();
    $('#a-skype-url-edit').show();
    $('#input-skype-url').hide();
    $('#span-create-skype').hide();
  },
  'change #select-participants'(event, instance) {
    // allotted timer adjust
    timeallotment();
  },
  //Stop timer Button
  'click div#timerbtn'(event, instance) {
    event.preventDefault();
    let lssid = $('.container[data-lssid]').data('lssid');
    let lssess = LearnShareSession.findOne({ _id: lssid });
    Meteor.call('timer.stop', lssid);
  },
  //Countdown timer
  'click #cdtimerbtn'(event, instance) {
    event.preventDefault();
    let lssid = $('.container[data-lssid]').data('lssid');
    let lssess = LearnShareSession.findOne({ _id: lssid });
    let timeId = Timer.findOne({
      learnShareSessionId: lssid,
      presenterId: 'countdown'
    });
    let cdtimer = $('#cdTimer');

    // countdown timer
    let allottedTime = parseInt($('#session-length').val());
    let sessionLength = allottedTime * 60;
    cdtimer.text(sessionLength);
    if (timeId == null)
      Meteor.call('timer.countdown', lssid, parseInt(sessionLength));
    else {
      $('#pausetimerbtn').hide();
      $('#playtimerbtn').css('display', 'inline');
    }

    // allotted timer adjust
    timeallotment();

    // hide start session and time input field
    $('.guestList').hide();

    // displays player controls
    $('#player-control').css('display', 'inline');
  },

  'change #select-team1'(event, instance) { 
    //event.preventDefault();
    let lssid = $('.container[data-lssid]').data('lssid');
    let lssess = LearnShareSession.findOne({ _id: lssid });
    let selectedTeam = $('#select-team1');
    lssess.setTeam(selectedTeam.val());
    $('#toggleTeam').hide();
  },

  'click #editTeam'(event, instance) {
    //event.preventDefault();
    let lssid = $('.container[data-lssid]').data('lssid');
    let lssess = LearnShareSession.findOne({ _id: lssid });
    $('#toggleTeam').toggle();
  },
  //Play timer button
  'click #playtimerbtn'(event, instance) {
    event.preventDefault();
    let lssid = $('.container[data-lssid]').data('lssid');
    let lssess = LearnShareSession.findOne({ _id: lssid });

    // allotted timer adjust
    //timeallotment();

    Meteor.call('timer.play', lssid);
    $('#playtimerbtn').hide();
    $('#pausetimerbtn').css('display', 'inline');
    playPresenterTimer();
    timeallotment();
  },
  //Pause timer Button
  'click #pausetimerbtn'(event, instance) {
    event.preventDefault();
    let lssid = $('.container[data-lssid]').data('lssid');
    let lssess = LearnShareSession.findOne({ _id: lssid });

    Meteor.call('timer.pause', lssid);
    $('#pausetimerbtn').hide();
    $('#playtimerbtn').css('display', 'inline');
    stopPresenterTimer();
    $('#playPTimer').hide();
    $('#resetPTimer').hide();
    timeallotment();
  },
  //Reset timer Button
  'click #resettimerbtn'(event, instance) {
    event.preventDefault();
    let lssid = $('.container[data-lssid]').data('lssid');

    //console.log("Session Id: " + lssid);
    //console.log("Timer Id: " + timeId)
    if (confirm('Are you sure you want to reset the Session Timer?')) {
      Meteor.call('timer.reset', lssid);
      // show start session and time input field
      $('.guestList').show();

      // hides player controls
      $('#player-control').hide();

      // Resets the play and pause button.
      $('#playtimerbtn').hide();
      $('#pausetimerbtn').css('display', 'inline');
    }
  },
    //Presenter's Stop timer Button
    'click div#pausePTimer'(event,instance) {
        event.preventDefault();
        stopPresenterTimer();
        timeallotment();
    },

    //Presenter's Play timer Button
    'click div#playPTimer'(event,instance) {
        event.preventDefault();
        playPresenterTimer();
        timeallotment();
    },

    //Presenter's Reset timer Button
    'click div#resetPTimer'(event,instance) {
        event.preventDefault();
        resetPresenterTimer();
        timeallotment();
    },    
}); 


/**
 * Notes Templates
 */
Template.ls_notes.onCreated(function() {
  this.autorun(() => {
    this.lssid = FlowRouter.getParam('lssid');
    this.subscription2 = this.subscribe('learnShareDetails', this.lssid);
    this.session = LearnShareSession.findOne({ _id: this.lssid });
    lsData.set('session', this.session);
  });
});

Template.ls_notes.helpers({
  isHost() {
    if (Meteor.user().roles.__global_roles__) {
      let isAdmin = Meteor.user().roles.__global_roles__.filter(
        role => role === 'admin'
      );
      if (isAdmin.length > 0) {
        return true;
      }
    }
    return false;
  },
  sessionNotes() {
    return lsData.get('session').notes;
  },
  isEditingEnabled() {
    if (lsData.get('editPermissions')) {
      return `Disable Notes`;
    } else {
      return `Allow Notes`;
    }
  },
  notesEnabled() {
    return lsData.get('session').sessionWideNotesEnabled;
  },
  volatileText() {
    if (lsData !== undefined && lsData.get('volatileNote') !== undefined) {
      return lsData.get('volatileNote').trim();
    } else {
      return '';
    }
  }
});

Template.ls_notes.events({
  'click #editPermissionsLink'(event, instance) {
    console.log('lsData.get(volatileNote): ', lsData.get('volatileNote'));
    if (instance.session.sessionWideNotesEnabled) { // turn notes on
      instance.session.enableNotes(false);
      lsData.set('editPermissions', false);
      lsData.set('volatileNote', $('#addNote').val());
    } else { // turn notes on
      instance.session.enableNotes(true);
      lsData.set('editPermissions', true);
    }
  },
  'click #addNotesBtn'(event, instance) {
    const note = {
      user: 'Learn Share Guest',
      details: $('#addNote').val()
    };
    if (Meteor.user() !== null) {
      note.user = Meteor.user().profile.first_name;
    } else {
    }
    if (note.details.trim().length > 0) instance.session.createNote(note);
    $('#addNote').val('');
    lsData.set('volatileNote', '');
  },
  'keypress #addNote'(event, instance) {
    if (event.keyCode === 13) {
      event.preventDefault(); // stop new line character
      $('#addNotesBtn').click();
    }
  }
});