import { Qnaire } from '/imports/api/qnaire/qnaire.js';
import './qnaire_list.html';
Template.qnaire_list.onCreated(function () {
    this.autorun( () => {
        this.subscription = this.subscribe('qnaire', {
            onStop: function () {
                console.log("Qnaire subscription stopped! ", arguments, this);
            },
            onReady: function () {
                console.log("Qnaire subscription ready! ", arguments, this);
            }
        });
    });
});
Template.qnaire_list.helpers({
    questionnaires() {
        console.log('????');
        let q = Qnaire.find( );
        console.log("ppppppppppppppppp",q.fetch());
        if (!q) {
            return [];
        }
        return q.fetch();
    }
});
Template.qnaire_list.events({
    'click button#create-qnaire'(event, instance) {
        let newQnaire = { title: $("#new-qnaire-title").val(), description: $("#new-qnaire-descr").val() };
        Meteor.call('qnaire.createNewQnaire', newQnaire, function (err, rslt) {
            console.log(err, rslt);
        })
    }
});
