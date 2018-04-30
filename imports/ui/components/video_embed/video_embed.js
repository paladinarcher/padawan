import './video_embed.html';

Template.video_embed.onCreated(function () {
    //
});

Template.video_embed.helpers({
    fileExists(fname) {
        let uploadPath = '/uploads/';
        if (fs.existsSync(uploadPath+fname)) {
            return true;
        } else {
            return false;
        }
    }
});
