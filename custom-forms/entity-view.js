var BBFView = require('isight/public/lib/backbone-form-view.js');
var utils = require('isight/public/lib/utils.js');
var entityModel = require('../../models/entity-model.js');
require('isight/public/lib/jquery.sticky.js');

module.exports = BBFView.extend({
	urlRoot: '/entity',
	Model: entityModel,
	formConfigName: 'entity-details',
	// List of features to manually enable for this view.
	features: {
		readOnlyFields: true
	},
	template: function () {
		if (this.model.isNew()) {
			return require('../../templates/custom-forms/new-entity-tmpl.dust');
		} else {
			return require('../../templates/custom-forms/entity-details-tmpl.dust');
		}
	},
	/***
	*   List of rules within the view
	*/
	rules: {
		isNew: function () {
			return this.model.isNew();
		},
		lockedByAnotherUser: function () {
			return this.model.get('isLockedByAnotherUser') === true;
		}
	},
	/**
	*   Crumbs defining a logical navigation path to the new note screen
	*/
	crumbs: function () {
		var crumbs = [];
		crumbs.push({ title: utils.translateKey('case'), url: '/cases' });
		// If a case Id is passed in, let's make the case part of breadcrumb as well
		if (this.model.get('caseId')) {
			crumbs.push({
				title: this.model.get('caseId__caseNumber'),
				url: '/case/' + this.model.get('caseId')
			});
			crumbs.push({
				title: utils.translateKey('entity'),
				url: '/case/' + this.model.get('caseId') + '/entities'
			});
		} else {
			crumbs.push({
				title: utils.translateKey('entity'),
				url: '/entities'
			});
		}
		if (this.model.isNew()) {
			// Continue adding generic breadcrumb
			crumbs.push({ title: utils.translateKey('new') });
		} else {
			crumbs.push({ title: this.model.get('number') });
		}

		return crumbs;
	},

	locals: function () {
		return {
			model: this.model.attributes,
			'case': null
		};
	}
});