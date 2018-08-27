var extend = require('isight/entities/extend.js');
var parentEnt = require('isight/entities/user');

module.exports = extend(parentEnt, {
	fields: [
		{
			field: 'filterField',
			type: 'picklist[]',
			caption: 'Filter Field',
			typeOptions: {
				picklistName: 'filter_fields'
			},
			kind: 'editable'
		},
		{
			field: 'viewConfidential',
			type: 'yesno',
			caption: 'View Confidential Cases',
			kind: 'editable'
		}
	],
	rules: require('./rules.js'),
	validation: require('./validation.js')
});