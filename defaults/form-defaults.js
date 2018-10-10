var _ = require('lodash');
var pluralize = require('pluralize');

module.exports = {
	caseCaptureFooter: [{
		type: 'section',
		caption: 'case_assignment',
		elements: [
			{ caption: 'assign_to', field: 'owner' },
			{ field: 'investigativeTeamMembers' }
		]
	}],
	caseOverviewHeader: [
		{ field: 'dateAssigned', readOnly: true },
		{ field: 'reopenDate', readOnly: true, displayRule: 'wasReopened' }
	],
	caseOverviewFooter: [
		{ type: 'section', caption: 'confidential',
			elements: [{ field: 'confidential' }], displayRule: 'canViewConfidential' }
	],
	caseResolutionFooter: [
		{ field: 'resolution' },
		{ field: 'resolutionSummaryNote' },
		{ field: 'resolutionDetails' },
		{ field: 'closeReason', readOnly: true, displayRule: 'isClosed' },
		{ field: 'reopenReason', readOnly: true, displayRule: 'wasReopened' }
	],
	caseRulesDefaults: {
		wasReopened: { function_header_truthy: 'reopenDate && data.caseStatus === \'open\';' },
		canViewConfidential: { function_header_confidential: 'typeof $appData !== \'undefined\' && ' +
			'($appData.user.viewConfidential === true || ' +
			'$appData.user.viewConfidential === \'true\');' }
	},
	childHeader: [
		{
			field: 'caseId',
			editRule: 'isNew && !isAddingToSpecificCase'
		}
	],
	partyTypeOptions: {
		requiredRoleForClosedCases: 'closed_case_add_party'
	}
};