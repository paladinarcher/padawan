import { User } from '/imports/api/users/users.js';
import { UserSegment } from '/imports/api/user_segments/user_segments.js';
import './user_profile.html';

Template.user_profile.onCreated(function () {
    if (this.data.userId) {
        this.userId = this.data.userId;
    } else if (FlowRouter.getParam('userId')) {
        this.userId = FlowRouter.getParam('userId');
    } else {
        this.userId = Meteor.userId();
    }
    this.autorun( () => {
        this.subscription = this.subscribe('userData', {
            onStop: function () {
                console.log("User profile subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User profile subscription ready! ", arguments, this);
            }
        });
        this.subscription2 = this.subscribe('userList', this.userId, {
            onStop: function () {
                console.log("User List subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("User List subscription ready! ", arguments, this);
            }
        });
        console.log(this.subscription2);
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
Template.user_profile.onRendered(function () {
    Meteor.setTimeout(function() {
        $("#input-bdate").datetimepicker({
            useCurrent:false,
            showClear:true,
            showClose:true,
            format:'YYYY-MM-DD'
        });
        $("#verification-email-tooltip").tooltip('disable');
        $("select#select-roles").each(function (s) {
            console.log("tttttttttttttttttttttttttttt 111111111111111111111");
            this.selectize.on('item_add', function(val, $item) {
                console.log(Template.instance());
                let userId = $item.closest("[data-user-id]").data("user-id");
                let u = User.findOne( {_id: userId} );
                u.addRole(val);
            });
            this.selectize.on('item_remove', function(val, $item) {
                let userId = $item.closest("[data-user-id]").data("user-id");
                let u = User.findOne( {_id: userId} );
                u.removeRole(val);
            });
        });
    }, 1500);
});

Template.user_profile.helpers({
    userId() {
        return Template.instance().userId;
    },
    userSegmentList() {
        let segList = [ {value:'',text:''} ];
        let s = UserSegment.find( );

        s.forEach((m) => {
            segList.push( {
                value: m._id,
                text: m.name
            });
        });
        return segList;
    },
    assignedUserSegments() {
        let uid = Template.instance().userId;
        let u = User.findOne( {_id:uid} );

        let assigned = [];

        if (u) {
            let segs = u.MyProfile.segments;
            console.log(segs, segs[0], UserSegment.findOne( {_id:segs[0]} ));
            for (let i = 0; i < segs.length; i++) {
                let segTxt = UserSegment.findOne( {_id:segs[i]} ).name;
                assigned.push( {
                    value: segs[i],
                    text: segTxt
                });
            }
        }
        console.log("assigned:", assigned);
        return assigned;
    },
    rolesList() {
        let roles = [];
        Roles.getAllRoles().forEach(function (r) {
            roles.push( {
                text: r.name,
                value: r.name
            } );
        });
        return roles;
    },
    assignedRoles() {
        let uid = Template.instance().userId;
        let u = User.findOne( {_id:uid} );
        console.log("getRolesForUser",Roles.getRolesForUser(u._id,Roles.GLOBAL_GROUP));
        return Roles.getRolesForUser(u._id,Roles.GLOBAL_GROUP);
    },
    userField(fldName) {
        let uid = Template.instance().userId;
        let u = User.findOne( {_id:uid} );
        if (u) {
            switch (fldName) {
            case 'firstName':
                return u.MyProfile.firstName;
                break;
            case 'lastName':
                return u.MyProfile.lastName;
                break;
            case 'fullName':
                return u.MyProfile.fullName();
                break;
            case 'gender':
                return (u.MyProfile.gender ? 'female' : 'male');
                break;
            case 'birthDate':
                let d = u.MyProfile.birthDate;
                if ("undefined" !== typeof d && null !== d) {
                    let dateText = new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,-1);
                    return dateText;
                } else {
                    return "";
                }
                break;
            case 'emailNotifications':
                console.log("userField?");
                if ("undefined" === typeof u.MyProfile.emailNotifications) {
                    u.MyProfile.emailNotifications = false;
                }
                return (u.MyProfile.emailNotifications ? 'checked' : '');
                break;
            case 'dashboardPanes':
                return (u.MyProfile.dashboardPanes.length > 0 ? 'Custom' : 'Default');
                break;
            }
            return u.MyProfile.fullName();
        } else {
            return "";
        }
    },
    genderSelected(label) {
        let uid = Template.instance().userId;
        let u = User.findOne( {_id:uid} );
        if (!u) return "";
        if (
            ("f" === label.slice(0,1) || "F" === label.slice(0,1)) &&
            u.MyProfile.gender === true
        ) {
            return "selected";
        }
        if (
            ("m" === label.slice(0,1) || "M" === label.slice(0,1)) &&
            u.MyProfile.gender === false
        ) {
            return "selected";
        }
        return "";
    },
    userName() {
        let uid = Template.instance().userId;
        let u = User.findOne( {_id:uid} );
        if (u) {
            return u.MyProfile.fullName();
        } else {
            return "";
        }
    },
    emailAddress() {
        let uid = Template.instance().userId;
        let u = User.findOne( {_id:uid} );
        if (u) {
            emailAddresses = [];
            for (let i = 0; i < u.emails.length; i++) {
                emailAddresses.push(u.emails[i].address);
            }
            return emailAddresses.join(',');
        } else {
            return "";
        }
    },
    itemAddHandler() {
        return (value, $item) => {
            let participant = {
                id: value,
                name: $item.text().slice(0,-1)
            };
        }
    },
    itemRemoveHandler() {
        return (value, $item) => {
            //
        }
    },
});

Template.user_profile.events({
    'change input.flat,textarea.flat,select'(event, instance) {
        $(event.target).addClass('changed');
        $("#btn-group").fadeIn();
    },
    'dp.change'(event, instance) {
        $(event.target).addClass('changed');
        $("#btn-group").fadeIn();
    },
    'keyup input,textarea'(event, instance) {
        let $t = $(event.target);
        $t.addClass('changed');
        $("#btn-group").fadeIn( );
    },
    'click button.btn-save'(event, instance) {
        let $t = $(event.target);
        $t.closest(".container").find(".changed").removeClass("changed");
        //todo: update database
        let uprofile = {
            firstName: $("#input-fname").val(),
            lastName: $("#input-lname").val(),
            gender: (true == $("#input-gender").val()),
            birthDate: $("#input-bdate").val(),
            segments: $("#select-segments").val(),
            emailNotifications: $("#sendEmailNotifications").prop("checked")
        };
        let uid = Template.instance().userId;
        let u = User.findOne( {_id:uid} );
        if (u) {
            u.profileUpdate(uprofile);
            //try to add the new email address and tell the user if they got an email verification if they did
            console.log("u.emails[0].address: ", u.emails[0].address);
            console.log("input-email value: ", $("#input-email").val());
            let newAddress = $("#input-email").val();
            Meteor.call( 'user.toSetEmail', newAddress,  (addEmailError) => {
                if (addEmailError) {
                    console.log("unable to add email: ", addEmailError.reason);
                    $("#verification-email-tooltip")
                        .tooltip('enable')
                        .tooltip({trigger: 'manual'})
                        .attr("data-original-title", "Unable to add email")
                        .tooltip('show');
                }
                else {
                  console.log('new email set');
                  //$("input-email").html(<p id="verification-email-updated" data-toggle="tooltip" data-placement="right" trigger="manual" title="A verification email has been sent">Email Address:</p>);
                  event.preventDefault();
                  Meteor.call( 'user.sendNewVerificationEmail', newAddress, () => {
                      //$("input-email").html(<p id="verification-email-updated" data-toggle="tooltip" data-placement="right" trigger="manual" title="A verification email has been sent">Email Address:</p>);
                      console.log('New Email Address verification sent');
                      $("#verification-email-tooltip")
                      .tooltip('enable')
                      .tooltip({trigger: 'manual'})
                      .attr('data-original-title', 'A verification email has been sent')
                      .tooltip('show');

                  });
                }
            });
        }
    },
    'click button.btn-cancel'(event, instance) {
        let $t = $(event.target);
        $t.closest(".container").find(".changed").removeClass("changed");
        $("#frm-profile")[0].reset();
    },
    'click button.btn-danger'(event, instance) {
        console.log("btn-danger was clicked");
        let $t = $(event.target);
        $t.closest(".container").find(".changed").removeClass("changed");
        let unwantedEmail = $("#input-email").val();
        Meteor.call( 'user.deleteEmail', unwantedEmail,  (deleteEmailError) => {
            if (deleteEmailError) {
                console.log("Unable to delete email");
                $("#verification-email-tooltip")
                    .tooltip('enable')
                    .tooltip({trigger: 'manual'})
                    .attr("data-original-title", "Unable to delete email")
                    .tooltip('show');
            }
            else {
                console.log("Email deleted");
                $("#verification-email-tooltip")
                    .tooltip('enable')
                    .tooltip({trigger: 'manual'})
                    .attr("data-original-title", "Email deleted")
                    .tooltip('show');
            }
        });
    }
});
