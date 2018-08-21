var TriggerModel = require('isight/public/models/trigger-model.js?original');
var _ = require('lodash');

module.exports = TriggerModel.extend({
	onParse: function (data) {
		// Set case type
		// HACK: added _.isString to ensure no filters on those objects
		if (_.isString(data.attributes.filterField)) {
			data.filterField = data.attributes.filterField;
		}

		return data;
	}
});