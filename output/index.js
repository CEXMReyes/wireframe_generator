var extend = require('isight/entities/extend.js');
var standardChildConfig = require('isight/entities/standard-child-config.js');

module.exports = extend(standardChildConfig, {
	db: 'default',
	table: 'sys_interview',
	entity: {
		base: 'sys',
		name: 'interview'
	},
	caption: 'Interview',
	captionPlural: 'Interviews',
	addCaption: 'Add Interview',
	newCaption: 'New Interview',
	search: true,
	api: {
		useGenericApi: true
	},
	fields: [
		{
			field: 'department',
			type: 'picklist',
			caption: 'Department',
			typeOptions: {
				picklistName: 'departments'
			},
			kind: 'editable'
		},
		{
			field: 'caseType',
			type: 'picklist',
			caption: 'Case Type',
			typeOptions: {
				picklistName: 'case_types'
			},
			kind: 'editable'
		},
		{
			field: 'subCaseType',
			type: 'picklist',
			caption: 'Sub Case Type',
			typeOptions: {
				picklistName: 'sub_case_types'
			},
			kind: 'editable'
		},
		{
			field: 'initialContactDate',
			type: 'date',
			caption: 'Initial Contact Date',
			kind: 'editable'
		},
		{
			field: 'incidentDate',
			type: 'date',
			caption: 'Incident Date',
			kind: 'editable'
		},
		{
			field: 'incidentLocation',
			type: 'picklist',
			caption: 'Incident Location',
			typeOptions: {
				picklistName: 'incident_locations'
			},
			kind: 'editable'
		},
		{
			field: 'reportingChannel',
			type: 'picklist[]',
			caption: 'Reporting Channel',
			typeOptions: {
				picklistName: 'reporting_channels'
			},
			kind: 'editable'
		},
		{
			field: 'urgency',
			type: 'picklist',
			caption: 'Urgency',
			typeOptions: {
				picklistName: 'urgencies'
			},
			kind: 'editable'
		},
		{
			field: 'primaryBasisOfDiscrimination',
			type: 'picklist',
			caption: 'Primary Basis of Discrimination',
			typeOptions: {
				picklistName: 'primary_basis_of_discriminations'
			},
			kind: 'editable'
		},
		{
			field: 'secondaryBasisOfDiscrimination',
			type: 'picklist',
			caption: 'Secondary Basis of Discrimination',
			typeOptions: {
				picklistName: 'secondary_basis_of_discriminations'
			},
			kind: 'editable'
		},
		{
			field: 'cleryReportFiled',
			type: 'yesno',
			caption: 'Clery Report Filed?',
			kind: 'editable'
		},
		{
			field: 'complainantType',
			type: 'picklist',
			caption: 'Complainant Type',
			typeOptions: {
				picklistName: 'complainant_types'
			},
			kind: 'editable'
		},
		{
			field: 'vehicleType',
			type: 'picklist',
			caption: 'Vehicle Type',
			typeOptions: {
				picklistName: 'vehicle_types'
			},
			kind: 'editable'
		},
		{
			field: 'oshaReportFiled',
			type: 'yesno',
			caption: 'OSHA Report Filed?',
			kind: 'editable'
		},
		{
			field: 'correctiveActionRequired',
			type: 'yesno',
			caption: 'Corrective Action Required?',
			kind: 'editable'
		},
		{
			field: 'leaveRequired',
			type: 'yesno',
			caption: 'Leave Required?',
			kind: 'editable'
		},
		{
			field: 'leaveType',
			type: 'picklist',
			caption: 'Leave Type',
			typeOptions: {
				picklistName: 'leave_types'
			},
			kind: 'editable'
		},
		{
			field: 'otherLeaveType',
			type: 'textbox',
			caption: 'Other Leave Type',
			kind: 'editable'
		},
		{
			field: 'leaveStartDate',
			type: 'date',
			caption: 'Leave Start Date',
			kind: 'editable'
		},
		{
			field: 'expectedReturnDate',
			type: 'date',
			caption: 'Expected Return Date',
			kind: 'editable'
		},
		{
			field: 'policeReportFiled',
			type: 'yesno',
			caption: 'Police Report Filed?',
			kind: 'editable'
		},
		{
			field: 'reportedToCampusPolice',
			type: 'yesno',
			caption: 'Reported To Campus Police?',
			kind: 'editable'
		},
		{
			field: 'legalInvolved',
			type: 'yesno',
			caption: 'Legal Involved?',
			kind: 'editable'
		},
		{
			field: 'counselName',
			type: 'textbox',
			caption: 'Counsel Name',
			kind: 'editable'
		},
		{
			field: 'assistanceProgram',
			type: 'yesno',
			caption: 'Assistance Program',
			kind: 'editable'
		},
		{
			field: 'amberAlertFiled',
			type: 'yesno',
			caption: 'Amber Alert Filed?',
			kind: 'editable'
		},
		{
			field: 'dateAmberAlertFiled',
			type: 'date',
			caption: 'Date Amber Alert Filed',
			kind: 'editable'
		},
		{
			field: 'alcoholInvolved',
			type: 'radio',
			caption: 'Alcohol Involved',
			typeOptions: {
				radios: [
					{
						value: 'yes',
						caption: 'yes'
					},
					{
						value: 'no',
						caption: 'no'
					},
					{
						value: 'unknown',
						caption: 'unknown'
					}
				],
				orientation: 'horizontal'
			},
			kind: 'editable'
		},
		{
			field: 'drugsInvolved',
			type: 'radio',
			caption: 'Drugs Involved',
			typeOptions: {
				radios: [
					{
						value: 'yes',
						caption: 'yes'
					},
					{
						value: 'no',
						caption: 'no'
					},
					{
						value: 'unknown',
						caption: 'unknown'
					}
				],
				orientation: 'horizontal'
			},
			kind: 'editable'
		},
		{
			field: 'unionInvolved',
			type: 'picklist',
			caption: 'Union Involved',
			typeOptions: {
				picklistName: 'union_involveds'
			},
			kind: 'editable'
		},
		{
			field: 'grievanceType',
			type: 'picklist',
			caption: 'Grievance Type',
			typeOptions: {
				picklistName: 'grievance_types'
			},
			kind: 'editable'
		},
		{
			field: 'otherGrievanceType',
			type: 'textbox',
			caption: 'Other Grievance Type',
			kind: 'editable'
		},
		{
			field: 'interimAction',
			type: 'picklist',
			caption: 'Interim Action',
			typeOptions: {
				picklistName: 'interim_actions'
			},
			kind: 'editable'
		},
		{
			field: 'actionsTaken',
			type: 'picklist',
			caption: 'Actions Taken',
			typeOptions: {
				picklistName: 'actions_takens'
			},
			kind: 'editable'
		},
		{
			field: 'caseDetails',
			type: 'texteditor',
			caption: 'Case Details',
			kind: 'editable'
		}
	],
	acl: require('./acl.js'),
	grids: require('./grids.js'),
	rules: require('./rules.js'),
	validation: require('./validation.js')
});