var BBView = require('isight/public/lib/backbone-view.js');
var utils = require('isight/public/lib/utils.js');

module.exports = BBView.extend({
	formConfigName: 'tab-name',
	template: require('../../templates/case/tab-name-tmpl.dust'),
	caption: utils.translateKey('tab_name'),
	// List of features to manually enable for this view.
	features: {
		readOnlyFields: true
	}
});
