module.exports = {
	'main-parties': {
		sortColumn: 'childNumber',
		sortOrder: 'desc',
		columns: [
			{ field: 'childNumber' },
			{ field: 'partyType' },
			{ field: 'partyName' },
			{ field: 'partyStatus' },
			{ field: 'createdDate' }
		]
	},
	'case-parties': {
		sortColumn: 'number',
		sortOrder: 'desc',
		columns: [
			{ field: 'number' },
			{ field: 'partyType' },
			{ field: 'partyName' },
			{ field: 'partyStatus' },
			{ field: 'createdDate' }
		]
	},
	'case-capture-parties': {
		sortColumn: 'partyName',
		sortOrder: 'asc',
		columns: [
			{ field: 'partyType' },
			{ field: 'partyName' }
		]
	},
	'advanced-search-result-parties': {
		sortColumn: 'childNumber',
		sortOrder: 'desc',
		columns: [
			{ field: 'childNumber' },
			{ field: 'partyType' },
			{ field: 'partyName' },
			{ field: 'partyStatus' },
			{ field: 'createdDate' }
		]
	}
};