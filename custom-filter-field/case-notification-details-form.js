module.exports = {
	name: 'case-notification',
	elements: [
		{
			type: 'section',
			caption: 'triggers',
			elements: [
				{ field: 'description' },
				{ field: 'event' },
				{
					field: 'filterField',
					caption: 'filter_field',
					type: 'picklist',
					typeOptions: {
						blankText: 'all',
						picklistName: 'filter_fields'
					}
				}
			]
		},
		{
			type: 'section',
			caption: 'distribution',
			elements: [
				{
					field: 'contextUsers'
				},
				{
					field: 'systemUsers'
				},
				{
					field: 'otherAddresses',
					width: 'col-xs-12 col-sm-3'
				}
			]
		},
		{
			comment: 'Content',
			caption: 'content',
			type: 'section',
			elements: [
				{ field: 'highPriority' },
				{ field: 'subject' },
				{ field: 'template' },
				{ field: 'fields' }
			]
		}
	]
};