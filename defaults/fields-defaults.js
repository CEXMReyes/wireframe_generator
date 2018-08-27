var _ = require('lodash');
var pluralize = require('pluralize');

module.exports = {
	indexHeader: function(entityName) {
		return 'var extend = require(\'isight/entities/extend.js\');\n' +
		'var parentEnt = require(\'isight/entities/' + entityName + '\');\n\n' +
		'module.exports = extend(parentEnt, ';
	},
	customHeader: 'var extend = require(\'isight/entities/extend.js\');\n' +
		'var standardChildConfig = require(\'isight/entities/standard-child-config.js\');\n\n' +
		'module.exports = extend(standardChildConfig, ',
	modelHeader: 'var BBModel = require(\'isight/public/lib/backbone-model.js\');\n\n' +
		'module.exports = BBModel.extend(',
	indexFooter: {
		acl: 'require(\'./acl.js\')',
		aclEs: 'require(\'./acl-es.js\')',
		grids: 'require(\'./grids.js\')',
		rules: 'require(\'./rules.js\')',
		validation: 'require(\'./validation.js\')'
	},
	defaultCaseFields: [
		{ field: 'openToClosedCalendarDays', type: 'number', caption: 'Open To Closed Calendar Days', kind: 'system' },
		{ field: 'openToClosedBusinessDays', type: 'number', caption: 'Open To Closed Business Days', kind: 'system' },
		{ field: 'dataSource', type: 'textbox', kind: 'hidden' },
		{ field: 'confidential', type: 'yesno', caption: 'Confidential', kind: 'editable' }
	],
	defaultResolutionFields: [
			{ field: 'resolution', type: 'picklist', caption: 'Resolution', typeOptions: { picklistName: 'resolutions' }, kind: 'editable' },
			{ field: 'resolutionSummaryNote', type: 'texteditor', caption: 'Resolution Summary Note', kind: 'editable' },
			{ field: 'resolutionDetails', type: 'texteditor', caption: 'Resolution Details', kind: 'editable' }
	],
	defaultCustomOptions: function(entityName) {
		return {
			db: 'default',
			table: 'sys_' + entityName,
			entity: { base: 'sys', name: entityName },
			caption: _.startCase(entityName),
			captionPlural: pluralize(_.startCase(entityName)),
			addCaption: 'Add ' + _.startCase(entityName),
			newCaption: 'New ' + _.startCase(entityName),
			search: true,
			api: { useGenericApi: true }
		}
	}
};