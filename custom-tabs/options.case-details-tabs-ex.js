/***
*		Case Details Tabs
*
*		This is only the default tab config, overwrite with options.case-details-tabs-ex in the config
*		project and setup RequireJS to reference the custom one instead.
*
*		TODO: Eventually this should be served from the backend, instead of requiring the views here
*					the backend would define the list of view's aliases to require dynamically and render as
*					tabs.
*/
var original = require('isight/public/config/options.case-details-tabs.js?original');
var TabNameView = require('../views/case/tab-name-view.js');

module.exports = [
	original[0],
	{
		id: 'halfName',
		caption: 'HalfName',
		View: TabNameView
	},
	original[1]
];
