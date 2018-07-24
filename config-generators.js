var path = require('path');

module.exports = {
	pathOn: false,
	generateBlankLists: true,
	defDir: './defaults',
	inDir: './input/',
	outDir: './output/',
	projDir: '<PROJECT PATH>',
	customFormsDir:'./custom-forms/',
	customTabsDir:'./custom-tabs/',
	customFormFilesPaths: {
		'acl.js': function (entityName) {
			return path.join('entities', entityName)
		},
		'entity-details-tmpl.dust': 'public/templates/custom-forms',
		'entity-tmpl.dust': 'public/templates/custom-forms',
		'entity-details-view.js': 'public/views/custom-forms',
		'new-entity-tmpl.dust': 'public/templates/custom-forms'
	},
	customTabFilesPaths: {
		'options.case-details-tabs-ex.js': 'public/config',
		'tab-name-tmpl.dust': 'public/templates/case',
		'tab-name-view.js': 'public/views/case'
	}
}