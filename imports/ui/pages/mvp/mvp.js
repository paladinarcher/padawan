import './mvp.html';
import { Accounts } from 'meteor/accounts-base'
import { Template } from 'meteor/templating';
import { callWithPromise } from '/imports/client/callWithPromise';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

const TMP_PP = new ReactiveVar();
async function get_pp(v, callback = function(){}) {
    let pp = await Meteor.call('tmp_pp', v, function(error, result){
        if(error){
            console.log('ERROR',error);
        }else{
            //console.log('RESULT',result);
            TMP_PP.set(result,'');
            callback();
            return result;
        }
     });
    return pp;
}
function hashCode (t){
    var hash = 0;
    if (t.length === 0) return hash;
    for (i = 0; i < t.length; i++) {
        char = t.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
    

Template.mvp_register.onCreated(function() {
    this.autorun(() => {
        this.subscription2 = this.subscribe("userList", this.userId, {
            onStop: function() {
                console.log("User List subscription stopped! ", arguments, this);
            },
            onReady: function() {
                console.log("User List subscription ready! ", arguments, this);
            }
        });
    });
});

Template.mvp_register.events({
    'submit #mvpRegister': async function(event, instance) {
        event.preventDefault();
        let val = $('#registerEmail').val();
        await get_pp(val, function() {
            let pass = TMP_PP.get();
            console.log('Submit',val,pass);
            Meteor.loginWithPassword(val,pass, function(e) {
                if(e) {
                    console.log('Error',e);
                } else {
                    console.log('User',Meteor.userId());
                }
            });
        });
    }
});