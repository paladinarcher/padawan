import { Qnaire } from '/imports/api/qnaire/qnaire.js';
import './qnaire_list.html';
import { ReactiveVar } from "meteor/reactive-var";

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
        this.currentQnrid = new ReactiveVar()
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
    },
    'click button.delete-qnaire' (event, instance) {
        let qnrid = $(event.target).data('qnrid')
        Template.instance().currentQnrid.set(qnrid)
        
        $('#confirm-delete').modal()
    },
    'click button#delete' (event, instance) {
        qnrid = Template.instance().currentQnrid.get()
        Meteor.call('qnaire.deleteQnaire', qnrid, function (err, rslt) {
            (err) ? console.log(err) : console.log(rslt)
        })
        $('#confirm-delete').modal('hide')
    }
});
