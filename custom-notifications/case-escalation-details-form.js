module.exports = {
	name: 'case-escalation',
	elements: [
		{ field: 'description' },
		{
			type: 'section',
			caption: 'criterias',
			elements: [
				{
					field: 'filterField',
					caption: 'filter_field',
					type: 'picklist',
					typeOptions: {
						blankText: 'all',
						picklistName: 'filter_fields'
					}
				},
				{
					field: 'escalation',
					caption: 'Starting',
					type: 'delay'
				},
				{
					field: 'trigger',
					caption: 'after_uppercase',
					type: 'picklist',
					typeOptions: {
						picklistName: 'escalation_triggers'
					}
				},
				{
					field: 'unless',
					caption: 'Unless',
					type: 'radio',
					typeOptions: {
						orientation: 'horizontal', //optional
						radios: [
							{
								caption: 'none',
								value: 'none'
							},
							{
								caption: 'case_closed',
								value: 'case_closed'
							}
						]
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
				{
					field: 'fields'
				}
			]
		}
	]
};