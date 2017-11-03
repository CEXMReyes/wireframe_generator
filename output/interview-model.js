var BBModel = require('isight/public/lib/backbone-model.js');

module.exports = BBModel.extend({
	urlRoot: $appData.globalConfig.apiRoot + '/interview',
	entity: {
		base: 'sys',
		name: 'interview'
	},
	idAttribute: 'id'
});