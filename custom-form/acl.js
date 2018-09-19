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
		name: 'View Entity Name',
		roles: ['view_entity_name'],
		actions: ['load', 'list'],
		conditions: []
	})
	.required({
		name: 'Create Entity Name',
		roles: ['create_entity_name'],
		actions: ['save_new', 'save_existing'],
		conditions: [{
			attributes: {
				'id': null
			}
		}]
	})
	.required({
		name: 'Edit Entity Name',
		roles: ['edit_entity_name'],
		actions: ['save_new', 'save_existing'],
		conditions: {
			attributes: {
				'!id': null
			}
		}
	})
	.required({
		name: 'Remove Entity Name',
		roles: ['remove_entity_name'],
		actions: ['remove'],
		conditions: []
	})
	.value();