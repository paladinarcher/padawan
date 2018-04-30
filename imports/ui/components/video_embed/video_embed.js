import './video_embed.html';

Template.video_embed.onCreated(function () {
    this._fileExists = new ReactiveVar(false);
    console.log(this.data);
    this.autorun( () => {
        Meteor.call('learnshare.recordingExists',this.data.id, (err,rslt) => {
            this._fileExists.set(rslt);
        });
    });
});

Template.video_embed.helpers({
    fileExists(fname) {
        return Template.instance()._fileExists.get();
    }
});
