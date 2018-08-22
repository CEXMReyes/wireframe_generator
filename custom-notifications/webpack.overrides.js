/***
*
*		Add to project config
*
*/
var overrides = {
	'isight/public/lib/escalations.hack.js': 'public/lib/escalations.hack-ex.js',
	'isight/public/views/settings/case-notification/case-notification-details-view.js':
		'public/views/settings/case-notification/case-notification-details-view-ex.js',
	'isight/public/models/trigger-model.js': 'public/models/trigger-model-ex.js',
	'isight/public/views/settings/picklist-settings-view.js':
		'public/views/settings/picklist-settings-view-ex.js'
};

module.exports = overrides;