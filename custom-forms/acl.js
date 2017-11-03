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
		name: 'View Entity',
		roles: ['view_entity'],
		actions: ['load', 'list'],
		conditions: []
	})
	.required({
		name: 'Create Entity',
		roles: ['create_entity'],
		actions: ['save_new', 'save_existing'],
		conditions: [{
			attributes: {
				'id': null
			}
		}]
	})
	.required({
		name: 'Edit Entity',
		roles: ['edit_entity'],
		actions: ['save_new', 'save_existing'],
		conditions: {
			attributes: {
				'!id': null
			}
		}
	})
	.required({
		name: 'Remove Entity',
		roles: ['remove_entity'],
		actions: ['remove'],
		conditions: []
	})
	.value();