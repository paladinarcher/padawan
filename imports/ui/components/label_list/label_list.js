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
