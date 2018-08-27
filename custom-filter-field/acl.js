var permHelper = require('isight/lib/core/permission-helper.js');
var _ = require('lodash');

module.exports = permHelper.initialize()
	.filter({
		name: 'Can edit the investigative team',
		roles: ['edit_investigative_team'],
		actions: ['save_new', 'save_existing'],
		conditions: [],
		filters: {
			'investigativeTeamMembers': false
		}
	})
	.filter({
		name: 'Can edit the Black list',
		roles: ['edit_blacklists'],
		actions: ['save_new', 'save_existing'],
		conditions: [],
		filters: {
			'userBlacklist': false
		}
	})
	.requisite({
		name: 'allows user to close a case',
		roles: ['close_a_case'],
		hard: true,
		actions: ['save_new', 'save_existing'],
		conditions: [{
			attributes: {
				'caseStatus': 'closed'
			}
		}]
	})
	.required({
		name: 'Can cancel a case',
		roles: ['cancel_a_case'],
		actions: ['save_existing'],
		conditions: [{
			attributes: {
				'caseStatus': 'canceled'
			}
		}]
	})
	.filter({
		name: 'modify status of close case',
		roles: ['reopen_case'],
		actions: ['save_existing'],
		conditions: [{
			attributes: {
				'caseStatus': 'closed'
			}
		}],
		filters: {
			'caseStatus': false,
			'reopenReason': false
		}
	})
	.requisite({
		name: 'anonymous draft case access',
		roles: ['view_cross_session_draft_cases'],
		actions: ['load', 'list', 'save_new', 'save_existing', 'remove'],
		conditions: [{
			fn: function (obj, context) {
				var loginId = context.user ? context.user.loginId : null;
				if (obj.caseStatus === 'draft' && obj.createdBySession !== loginId) {
					return { ok: true };
				} else {
					// Skip
					return { ok: undefined };
				}
			}
		}]
	})
	.sufficient({
		name: 'External Capture Create',
		roles: ['anonymous'],
		actions: ['save_new'],
		conditions: []
	})
	.sufficient({
		name: 'View, Read, Write on cases user created and in draft status',
		roles: ['agent'],
		actions: ['load', 'list', 'save_new', 'save_existing'],
		conditions: [{
			attributes: {
				'caseStatus': 'draft',
				'createdBy': '{user.id}'
			}
		}]
	})
	.requisite({
		name: 'View, Read, Write on draft Cases',
		roles: ['access_draft_cases'],
		actions: ['load', 'list', 'save_existing'],
		conditions: [{
			attributes: {
				'caseStatus': 'draft'
			}
		}]
	})
	.filter({
		name: 'edit owner/assignedTo',
		roles: ['assign_case'],
		actions: ['save_new', 'save_existing'],
		conditions: [{
			attributes: {
				'!id': null
			}
		}],
		filters: {
			'owner': false,
			'reassignReason': false
		}
	})
	.required({
		name: 'access to cases',
		roles: ['agent'],
		actions: ['load', 'list', 'save_new', 'save_existing'],
		conditions: []
	})
	.requisite({
		name: 'manual_blacklist',
		roles: ['agent'],
		hard: true,
		actions: ['load', 'list', 'save_new', 'save_existing'],
		conditions: [{
			attributes: {
				'userBlacklist': '{!user.id}'
			}
		}]
	})
	.requisite({
		name: 'system_blacklist',
		roles: ['agent'],
		hard: true,
		actions: ['load', 'list', 'save_new', 'save_existing'],
		conditions: [{
			attributes: {
				'systemBlacklist': '{!user.id}'
			}
		}]
	})
	.requisite({
		name: 'view confidential cases',
		roles: ['view_confidential_cases'],
		actions: ['load', 'list'],
		conditions: [{
			attributes: {
				'confidential': true
			}
		}]
	})
	.required({
		name: 'access to read and edit canceled cases',
		roles: ['cancelled_cases'],
		actions: ['load', 'list', 'save_existing'],
		conditions: [{
			attributes: {
				'caseStatus': 'canceled'
			}
		}]
	})
	.sufficient({
		name: 'access to cases where user is an investigative team member',
		roles: ['investigative_team_member'],
		actions: ['load', 'list', 'save_existing', 'save_new'],
		conditions: [{
			attributes: {
				'investigativeTeamMembers': '{user.id}'
			}
		}]
	})
	.sufficient({
		name: 'access to specific users owned cases',
		roles: ['case_owner'],
		actions: ['load', 'list', 'save_existing', 'save_new'],
		conditions: [{
			attributes: {
				'owner': '{user.id}'
			}
		}]
	})
	.sufficient({
		name: 'view cases in same filter field',
		roles: ['view_filter_field_cases'],
		actions: ['load', 'list'],
		conditions: [{
			fn: function (obj, context) {
				var filterField = context.user ? context.user.filterField : null;
				if (filterField && _.includes(filterField, obj.filterField)) {
					return { ok: true };
				} else {
					// Skip
					return { ok: undefined };
				}
			}
		}]
	})
	.required({
		name: 'View Case',
		roles: ['view_case'],
		actions: ['load', 'list'],
		conditions: []
	})
	.required({
		name: 'Create Case',
		roles: ['create_case'],
		actions: ['save_new', 'save_existing'],
		conditions: [{
			attributes: {
				'id': null
			}
		}]
	})
	.required({
		name: 'Edit Case',
		roles: ['edit_case'],
		actions: ['save_existing'],
		conditions: {
			attributes: {
				'!id': null
			}
		}
	})
	.required({
		name: 'Remove Case',
		roles: ['remove_case'],
		actions: ['remove'],
		conditions: []
	})
	.value();