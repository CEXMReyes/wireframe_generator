var permHelper = require('isight/lib/core/permission-helper.js');

module.exports = permHelper.initialize()
	.requisite({
		name: 'child docs, prevent new on cancelled',
		// Note this role is note meant to be used by anyone and is used to block
		// adding child docs to a cancelled
		roles: ['edit_canceled_case_children'],
		actions: ['save_new', 'save_existing', 'remove'],
		conditions: [{
			attributes: {
				'caseId__caseStatus': 'canceled'
			}
		}]
	})
	.requisite({
		name: 'prevent deletion of closed case child docs',
		roles: ['delete_closed_case_children'],
		actions: ['remove'],
		conditions: [{
			attributes: {
				'caseId__caseStatus': 'closed'
			}
		}]
	})
	.requisite({
		name: 'prevent deletion of closed case child docs',
		roles: ['delete_canceled_case_children'],
		actions: ['remove'],
		conditions: [{
			attributes: {
				'caseId__caseStatus': 'canceled'
			}
		}]
	})
	.requireCaseInheritance()
	.required({
		name: 'View Interview',
		roles: ['view_interview'],
		actions: ['load', 'list'],
		conditions: []
	})
	.required({
		name: 'Create Interview',
		roles: ['create_interview'],
		actions: ['save_new', 'save_existing'],
		conditions: [{
			attributes: {
				'id': null
			}
		}]
	})
	.required({
		name: 'Edit Interview',
		roles: ['edit_interview'],
		actions: ['save_new', 'save_existing'],
		conditions: {
			attributes: {
				'!id': null
			}
		}
	})
	.required({
		name: 'Remove Interview',
		roles: ['remove_interview'],
		actions: ['remove'],
		conditions: []
	})
	.value();