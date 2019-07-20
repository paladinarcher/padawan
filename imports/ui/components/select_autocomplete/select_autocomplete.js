import './select_autocomplete.html';

Template.select_autocomplete.onCreated(function () {
    //
});

Template.select_autocomplete.onRendered(function () {
    var self = this;
    self.autorun( function () {
        console.log("select_autocomplete autorun");
        var dat = Template.currentData();

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
        if (typeof dat.readOnly !== "undefined") {
            params.readOnly = true;
            params.plugins = [];
        }
        if (typeof dat.create !== "undefined") {
            params.create = true;
        }
        let $select = $('#'+dat.id+dat.id2).selectize(params);
        $select[0].selectize.clear(true);
        $select[0].selectize.clearOptions();
        $select[0].selectize.addOption(dat.list);
        if ("undefined" !== typeof dat.selected) {
			for (let i in dat.selected) {
				let id = dat.selected[i];
				if ("string" !== typeof id) {
					id = id.value;
				}
				if ("undefined" === typeof _.find(dat.list,function(o){return o.value===id})) {
					$select[0].selectize.addOption(dat.selected[i]);
					$select[0].selectize.addItem(id,true);
				} else {
					$select[0].selectize.addItem(id,true);
				}
			}
        }
        $select[0].selectize.refreshItems();
		if(dat.nextParticipant) {
			$('.item[data-value="' + dat.nextParticipant + '"]').addClass('picking');
			$("#p-on-deck-info").data("picking", dat.nextParticipant);
			$("#p-on-deck-info").html($('.item[data-value="' + dat.nextParticipant + '"]').html().slice(0, $('.item[data-value="' + dat.nextParticipant + '"]').html().indexOf('<')));
			$("#p-on-deck").show();
			$("#p-pick-first").hide();
		}
    });
});