module.exports = {
	name: 'user-details',
	elements: [
		{ field: 'active' },
		{ field: 'ssoUser' },
		{ field: 'nick' },
		{ field: 'employment' },
		{ field: 'viewConfidential' },
		{
			field: 'filterField',
			displayRule: 'employmentIsAnalyst'
		},
		{
			type: 'section',
			elements: [
				{ field: 'firstName' },
				{ field: 'lastName' },
				{ field: 'email' },
				{ field: 'locale' },
				{ field: 'signature' }
			]
		}
	]
};