import './select_autocomplete.html';

Template.select_autocomplete.onCreated(function () {
    //
});

Template.select_autocomplete.onRendered(function () {
    var self = this;
    self.autorun( function () {
        var dat = Template.currentData();
        console.log("select_autocomplete autorun", dat);

        if (!dat.list || dat.list.length < 1) {
            return;
        }
        var params = {
            plugins: ['remove_button'],
            options: dat.list
        }
        if (typeof dat.onItemAdd !== "undefined") {
            params.onItemAdd = dat.onItemAdd;
        }
        if (typeof dat.onItemRemove !== "undefined") {
            params.onItemRemove = dat.onItemRemove;
        }
        let $select = $('#'+dat.id+dat.id2).selectize(params);
        console.log($select);
        $select[0].selectize.clear(true);
        $select[0].selectize.clearOptions();
        $select[0].selectize.addOption(dat.list);
        if ("undefined" !== typeof dat.selected) {
            for (let i in dat.selected) {
                $select[0].selectize.addItem(dat.selected[i],true);
            }
        }
        $select[0].selectize.refreshItems();
    });
});
