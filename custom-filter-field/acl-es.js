var permHelper = require('../../lib/core/permission-helper-es.js');
var _ = require('lodash');

module.exports = function(args, joinField) {
	var userFilterFields = args.user$.filterField || [];

	var filter = permHelper.must([
		args.showInactiveRecords !== true && permHelper.getActiveFilter(joinField),
		args.showCanceledCases$ !== true &&
			permHelper.mustNot(permHelper.term(joinField, 'caseStatus', 'canceled')),
		permHelper.mustNot(permHelper.term(joinField, 'userBlacklist', args.user$.id)),
		(_.includes(args.user$.perm.roles, 'view_filter_field_cases') &&
			permHelper.should([
					permHelper.term(joinField, 'owner', args.user$.id),
					permHelper.terms(joinField, 'filterField', userFilterFields),
					permHelper.term(joinField, 'investigativeTeamMembers', args.user$.id)
				])
			),

		(!args.user$.viewConfidential &&
			permHelper.should([
					permHelper.term(joinField, 'confidential', args.user$.viewConfidential)
				])
			)
	]);
	return filter;
};