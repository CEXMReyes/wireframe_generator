var path = require('path');

module.exports = {
	pathOn: false,
	generateBlankLists: true,
	defDir: './defaults',
	inDir: './input/',
	outDir: './output/',
	projDir: '<PROJECT_DIR>',
	customFormsDir:'./custom-form/',
	customFilterFieldDir:'./custom-filter-field/',
	customTabsDir:'./custom-tab/',
	customFormFilesPaths: {
		'acl.js': function (entityName) {
			return path.join('entities', entityName)
		},
		'entity-name-details-tmpl.dust': 'public/templates/custom-forms',
		'entity-name-details-view.js': 'public/views/custom-forms',
		'new-entity-name-tmpl.dust': 'public/templates/custom-forms'
	},
	customTabFilesPaths: {
		'options.case-details-tabs-ex.js': 'public/config',
		'tab-name-tmpl.dust': 'public/templates/case',
		'tab-name-view.js': 'public/views/case'
	},
	sortPicklist: false,
	rankPicklist: false,
	picklistOtherValues: [
		'Other',
		'N/A'
	]
}