import './label_list.html';

Template.label_list.onCreated(function () {
    //
});

Template.label_list.helpers({
    customClass(item) {
        if ("guest" === item.value.slice(0,5)) {
            return "guest";
        } else {
            return "";
        }
    }
})
Template.label_list.onRendered(function () {
    var self = this;
    self.autorun( function () {
        console.log("label_list autorun");
        var dat = Template.currentData();
        if (!dat.nextParticipant) {
            return;
        }
	    $('.picking').removeClass('picking').css('background-color', '');
	    $('.label[data-value="' + dat.nextParticipant + '"]').addClass('picking');

	    $('.label[data-value="' + dat.nextParticipant + '"]').css('background-color', '#ffa07a');
 	})
})