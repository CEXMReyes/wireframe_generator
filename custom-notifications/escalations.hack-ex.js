var utils = require('isight/public/lib/utils.js');
var _ = require('lodash');

module.exports = {
	formatUIToDB: function (model) {
		var attributes = {};

		attributes.caseStatus = ['!canceled'];

		switch (model.get('trigger')) {
			case 'Case Last Modified':
				attributes.lastUpdatedDate = '*';
				model.set('escalationReference', 'lastUpdatedDate');
				break;
			case 'Case Recorded':
				attributes.dateRecorded = {from: 'empty', to: '*'};
				model.set('escalationReference', 'createdDate');
				break;
		}

		if (model.get('filterField')) {
			attributes.filterField = model.get('filterField');
		}

		switch (model.get('unless')) {
			case 'case_closed':
				attributes.caseStatus.push('!closed');
				break;
		}

		model.set('target', 'sys/case');
		model.set('attributes', attributes);
	},
	formatDBToUI: function (model) {
		var attributes = model.get('attributes') || {};
		model.set('attributes', {});
		if(_.isEqual(attributes.dateRecorded, {from: 'empty', to: '*'})) {
			model.set('trigger', 'Case Recorded');
		} else if (attributes.lastUpdatedDate === '*') {
			model.set('trigger', 'Case Last Modified');
		}

		if(attributes.caseStatus === '!closed' || _.includes(attributes.caseStatus, '!closed')) {
			model.set('unless', 'case_closed');
		} else {
			model.set('unless', 'none');
		}
		model.set({
			filterField: attributes.filterField,
			filterFieldName: attributes.filterField ? attributes.filterField
				: utils.translateKey('all')
		});

	}
};