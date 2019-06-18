import { User } from '/imports/api/users/users.js';
import { UserSegment } from '/imports/api/user_segments/user_segments.js';
import { Accounts } from 'meteor/accounts-base';
import { mbtiGraph } from '../../components/mbtiGraph/mbtiGraph.js';
import { behavior_pattern_area } from '../../components/behavior_pattern_area/behavior_pattern_area.js';
import './user_profile.html';

var minQuestionsAnswered = 72;

function setPassword(elementId) {
    let uid = Template.instance().userId;
	let newPass = $("#input-password").val();
	let oldPass = $("#old-password").val();
	if (newPass == "" || oldPass == "") {
		document.getElementById(elementId).innerHTML = '<div class="alert alert-warning alert-margin"><strong>Enter passwords!</strong></div>';
	} else {
		Accounts.changePassword(oldPass, newPass, function (error) {
			if (error) {
				console.log("Failed to change password: ", error);
				document.getElementById(elementId).innerHTML = '<div class="alert alert-warning alert-margin"><strong>No Password Change!</strong></div>';
			} else {
				console.log("Password changed");
				document.getElementById(elementId).innerHTML = '<div class="alert alert-success alert-margin"><strong>Password Changed!</strong></div>';
			}
		});
	}
}
function sendVerificationEmail(elementId) {
        document.getElementById(elementId).innerHTML = '<div class="alert alert-warning alert-margin"><strong>Processing!</strong></div>';
        let uid = Template.instance().userId;
        let user = User.findOne({_id: uid});
        let email = $("#input-email").val();

        if (email == "") {
            document.getElementById(elementId).innerHTML = '<div class="alert alert-warning alert-margin"><strong>Enter email!</strong></div>';
        }
        else {
            Meteor.call('user.toSetEmail', email, (error, result) => { // add email if not added
                if (error) {
                    // console.log("toSetEmail error: ", error);
                    if (error.error == 'Email already verified') {
                        document.getElementById(elementId).innerHTML = '<div class="alert alert-danger alert-margin"><strong>Already verified!</strong></div>';
                    }
                    else {
                        document.getElementById(elementId).innerHTML = '<div class="alert alert-danger alert-margin"><strong>Email not sent!</strong></div>';
                    }
                } else {
					Meteor.call('user.sendVerificationEmail', (error, result) => {
						if (error) {
							//console.log("EEERRR0r: ", error);
							document.getElementById(elementId).innerHTML = '<div class="alert alert-danger alert-margin"><strong>Email not sent!</strong></div>';
						} else {
							// console.log("Accounts.sendVerificationEmail returned: ", result);
							document.getElementById(elementId).innerHTML = '<div class="alert alert-success alert-margin"><strong>Email sent!</strong></div>';
						}
					});
                }
            });
        }
}

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
                    let dateText = new Date(d.getTime()).toISOString().slice(0,10);
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
    emailVerified() {
        let uid = Template.instance().userId;
        let user = User.findOne({_id: uid});
        let verified = false;
        user.emails.forEach(function(email) {
            if (email.verified == true) {
                verified = true;
            }
        });
        return verified;
    },
    emailZero() {
        let uid = Template.instance().userId;
        let u = User.findOne( {_id:uid} );
        return u.emails[0].address;
    },
    notifications() {
      let uid = Template.instance().userId;
      let u = User.findOne( {_id:uid} );
      return u.MyProfile.emailNotifications;
    },
    user() {
        return User.findOne({_id:Template.instance().userId});
    },
    isMinMet() {
        let u = User.findOne({_id:Template.instance().userId});
        if (!u) return false;
        if (u.MyProfile.UserType.AnsweredQuestions.length >= minQuestionsAnswered) {
            return true;
        } else {
            return false;
        }
    },
    opacityByCategory(category, userObj) {
        if (typeof userObj === "undefined") return false;
        var value = userObj.MyProfile.UserType.Personality[userObj.MyProfile.UserType.Personality.getIdentifierById(category)];
        return (Math.abs(value.Value) * 2) / 100;
    },
    letterByCategory(category, userObj) {
        if (typeof userObj === "undefined") return false;
        var identifier = userObj.MyProfile.UserType.Personality.getIdentifierById(category);
        var value = userObj.MyProfile.UserType.Personality[identifier].Value;
        if (userObj.MyProfile.UserType.AnsweredQuestions.length >= minQuestionsAnswered) {
            return (value === 0 ? "?" : (value < 0 ? identifier.slice(0,1) : identifier.slice(1,2)));
        } else {
            return "?";
        }
    },
    results(category, userObj) {
        let identifier = userObj.MyProfile.UserType.Personality.getIdentifierById(
          category
        );

        let identifierValue =
          userObj.MyProfile.UserType.Personality[identifier].Value;

        let percentageValue =
          userObj.MyProfile.UserType.Personality[
            userObj.MyProfile.UserType.Personality.getIdentifierById(category)
          ];
    
        let percentage = Math.ceil(Math.abs(percentageValue.Value));
    
        if (identifierValue) {
          return 50 + percentage;
        }
      }
});

Template.user_profile.events({
    "click a#results_descriptions"(event, instance) {
        event.preventDefault();
        FlowRouter.go("/resultsDescriptions");
    },
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
        let segs = $("#select-segments").val();
        $t.closest(".container").find(".changed").removeClass("changed");
        //todo: update database
        let uprofile = {
            firstName: $("#input-fname").val(),
            lastName: $("#input-lname").val(),
            gender: (true == $("#input-gender").val()),
            birthDate: $("#input-bdate").val(),
            segments: (Array.isArray(segs) ? segs : [])
        };
        let uid = Template.instance().userId;
        let u = User.findOne( {_id:uid} );
        if (u) {
            u.profileUpdate(uprofile);
        }
    },
    'click button.btn-cancel'(event, instance) {
        let $t = $(event.target);
        $t.closest(".container").find(".changed").removeClass("changed");
        $("#frm-profile")[0].reset();
    },
    'click #verifyButton'(event, instance) {
        sendVerificationEmail('emailAlert');
    },
    'keypress #input-email': function(event) {
		if (event.which === 13) { // key 13 is the enter button
			event.preventDefault();
			sendVerificationEmail('emailAlert');
		}
    },
    'click #passwordButton'(event, instance) {
        setPassword('passwordAlert');
    },
    'keypress #old-password': function(event) {
		if (event.which === 13) { // key 13 is the enter button
			event.preventDefault();
        	setPassword('passwordAlert');
		}
    },
    'keypress #input-password': function(event) {
		if (event.which === 13) { // key 13 is the enter button
			event.preventDefault();
        	setPassword('passwordAlert');
		}
    },
    'click .sendEmailNotifications'(event, instance) {
        // if sendEmailNotifications is checked, it will be true
        // alert("in sendEmailNotifications");
        let checkedValue = $(seNotifications).prop("checked");
        console.log("The checkmark was clicked: ", checkedValue);
        // alert(checkedValue);

        let uid = Template.instance().userId;
        let u = User.findOne( {_id:uid} );
        u.MyProfile.emailNotifications = checkedValue;
        $("#emailNotifyAlert").html('<div class="alert alert-warning alert-margin"><strong>Processing!</strong></div>');
        $(seNotifications).attr("disabled", true);

        Meteor.call('user.setEmailNotifications', checkedValue, (error) => {
              if (error) {
                  console.log("sendEmailNotifications error: ", error);
                  // alert("notify error");
                  $("#emailNotifyAlert").html('<div class="alert alert-danger alert-margin"><strong>Failure!</strong></div>');
                  $(seNotifications).removeAttr("disabled");
              }
              else {
                  console.log("sendEmailNotifications succesful");
                  // alert("notify success");
                  $("#emailNotifyAlert").html('<div class="alert alert-success alert-margin"><strong>Changed!</strong></div>');
                  $(seNotifications).removeAttr("disabled");
              }
        });
    }
    // no longer deleting emails. delete this code if you feel lucky.
    // 'click button.btn-danger'(event, instance) {
    //     console.log("btn-danger was clicked");
    //     let $t = $(event.target);
    //     $t.closest(".container").find(".changed").removeClass("changed");
    //     let unwantedEmail = $("#input-email").val();
    //     Meteor.call( 'user.deleteEmail', unwantedEmail,  (deleteEmailError) => {
    //         if (deleteEmailError) {
    //             console.log("Unable to delete email");
    //             $("#verification-email-tooltip")
    //                 .tooltip('enable')
    //                 .tooltip({trigger: 'manual'})
    //                 .attr("data-original-title", "Unable to delete email")
    //                 .tooltip('show');
    //         }
    //         else {
    //             console.log("Email deleted");
    //             $("#verification-email-tooltip")
    //                 .tooltip('enable')
    //                 .tooltip({trigger: 'manual'})
    //                 .attr("data-original-title", "Email deleted")
    //                 .tooltip('show');
    //         }
    //     });
    // }
});
