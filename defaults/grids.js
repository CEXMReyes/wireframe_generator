module.exports = {
	'main-cases': {
		sortColumn: 'caseNumber',
		sortOrder: 'desc',
		columns: [
			{ field: 'caseNumber' },
			{ field: 'caseType' },
			{ field: 'caseStatus' },
			{ field: 'owner' },
			{ field: 'createdDate' }
		]
	},
	'canceled-cases': {
		sortColumn: 'caseNumber',
		sortOrder: 'desc',
		columns: [
			{ field: 'caseNumber' },
			{ field: 'caseType' },
			{ field: 'owner' },
			{ field: 'cancelDate' },
			{ field: 'createdDate' }
		]
	},
	'advanced-search-result-cases': {
		sortColumn: 'caseNumber',
		sortOrder: 'desc',
		columns: [
			{ field: 'caseNumber' },
			{ field: 'caseType' },
			{ field: 'caseStatus' },
			{ field: 'owner' },
			{ field: 'createdDate' }
		]
	},
	'cases-queue': {
		sortColumn: 'caseNumber',
		sortOrder: 'desc',
		columns: [
			{ field: 'caseNumber' },
			{ field: 'caseType' },
			{ field: 'caseStatus' },
			{ field: 'owner' },
			{ field: 'createdDate' }
		]
	}
};