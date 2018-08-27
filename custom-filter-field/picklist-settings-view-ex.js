var PicklistSettingsView =
	require('isight/public/views/settings/picklist-settings-view.js?original');
var PicklistsCollection = require('isight/public/collections/picklists-collection.js');

module.exports = PicklistSettingsView.extend({
	onInit: function (options) {
		// Determine which picklist will be selected at first,
		// then create the collection for that picklist
		this.selectedPicklistName = 'filter_fields';
		if (options && options.picklistName) {
			this.selectedPicklistName = options.picklistName;
		}
		this.collection = new PicklistsCollection(null, { name: this.selectedPicklistName });
	}
});