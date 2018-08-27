var _ = require('lodash');
var idType = require('isight/field-types/id/');
var utils = require('isight/field-types/utils');

module.exports = utils.extend(idType, {
	name: 'case',
	db: {
		foreign: 'sys_case',
		defaultJoinAttribute: 'caseNumber',
		join: [
			'caseNumber',
			'caseStatus',
			'userBlacklist',
			'sysActive',
			'createdDate',
			'filterField',
			'investigativeTeamMembers',
			'confidential',
			'owner'
		]
	},
	ui: {
		component: function () {
			return require('isight/field-types/case/component.js');
		},
		formComponent: function () {
			return require('isight/field-types/case/form-component.js');
		},
		searchComponent: function () {
			return require('isight/field-types/case/component.js');
		}
	},
	escape: function (val) {
		return _.escape(val);
	},
	format: function (val, context) {
		if (!val) return '';
		var field = context.fieldDef.field;
		return context.data[field + '__caseNumber'] || '';
	}
});