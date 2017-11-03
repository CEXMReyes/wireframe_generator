var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var pluralize = require('pluralize');
var inDir = './input/';
var outDir = './output/';
var formName = process.argv[2] ? process.argv[2] : 'case-capture';


// Run
fs.readFile(path.join(inDir, 'form.txt'), 'utf8', function (err, data) {
	if (err) console.error(err);
	var input =  _.map(data.split('\n'), function (item) {
		return item.split('\t');
	});
	writeToFile(formName + '-form.js', generateForm(input));
	writeToFile('rules.js', rules);
	writeToFile('validation.js', validation);
});

// Variables
var rules = {};
var validation = {
	mandatory$: [],
	dependentMandatory$: []
};
var caseCaptureFooter = [{
	type: 'section',
	caption: 'case_assignment',
	elements: [
		{ caption: 'assign_to', field: 'owner' },
		{ field: 'investigativeTeamMembers' }
	]
}];
var caseOverviewHeader = [
	{ field: 'dateAssigned', readOnly: true },
	{ field: 'reopenDate', readOnly: true, displayRule: 'wasReopened' }
];
var caseResolutionFooter = [
		{ field: 'closeReason', readOnly: true, displayRule: 'isClosed' },
		{ field: 'reopenReason', readOnly: true, displayRule: 'wasReopened' }
];
var closeMandatory = { condition: 'isClosed', fields: ['closeReason'] };
var childHeader = [
	{
		field: 'caseId',
		editRule: 'isNew && !isAddingToSpecificCase'
	}
];
var partyTypeOptions = {
	requiredRoleForClosedCases: 'closed_case_add_party'
};

// Functions
function generateForm(listOfLists) {
	if(!_.includes(formName, 'case')) addValidation('caseId', '*');
	var output = _.map(listOfLists, function (list) {
		var field = {
			field: _.camelCase(list[0]),
		}

		if(list[1]) {
			var rule = list[1].trim() === '*' ? '*' : generateRules(list[1]);
			addValidation(field.field, rule);
		}

		if(list[2]) {
			if(_.includes(list[2], '||')) {
				var multiRules = _.map(list[2].split('||'), function(item) {
					return generateRules(item);
				});
				field.displayRule = multiRules.toString().replace(/,/g, ' || ');
			} else {
				field.displayRule = generateRules(list[2]);
			}
		}

		return field;
	});

	if(formName === 'case-overview') {
		output = caseOverviewHeader.concat(output);
	} else if(!_.includes(formName, 'case')) {
		output = childHeader.concat(output);
		if(formName === 'party-details') output[0].typeOptions = partyTypeOptions;
	}
	return { elements: output };
}

function generateRules(data) {
	var ruleList = data.split('=');
	var displayRule = _.map(ruleList[1].split('OR'), function(value) {
		var rule = _.camelCase(ruleList[0] + ' is ' + value);
		addRule(ruleList[0], rule, value);
		return rule;
	});
	return displayRule.toString().replace(/,/g, ' || ');
}

function addRule(field, rule, value) {
	rules[rule] =  rules[rule] ?
		rules[rule] :
		{ function_header: _.camelCase(field) + ' === \'' + _.snakeCase(value) + '\';' };
}

function addValidation(childField, displayRule) {
	if(displayRule === '*') {
		if(!_.includes(validation.mandatory$, childField)) validation.mandatory$.push(childField);
	} else {
		var conditionExists = false;
		_.forEach(validation.dependentMandatory$, function(item, key) {
			if(item.condition === displayRule) {
				conditionExists = true;
				if(!_.includes(validation.dependentMandatory$[key].fields, childField)) {
					validation.dependentMandatory$[key].fields.push(childField);
				}
				return false;
			}
		});
		if(!conditionExists) validation.dependentMandatory$.push({ condition: displayRule, fields: [childField] });
	}
}

function rulesFormat(data) {
	return JSON.stringify(data, null, '\t')
		.replace(/: {/g, ": function (data) {")
		.replace(/function_header/g, "return data.")
		.replace(/"/g, "")
		.replace(/data.: /g, "data.");
}

function formFormat(data) {
	return JSON.stringify(data, null, '\t')
		.replace(/\"([^(\")"]+)\":/g,"$1:")
		.replace(/"/g, "'");
}

function writeToFile(fileName, content) {
	var file = fs.createWriteStream(path.join(outDir, fileName));
	var output = 'module.exports = ';
	if(_.includes(fileName, 'form.js')) {
		if(formName === 'case-capture') content.elements = content.elements.concat(caseCaptureFooter);
		if(formName === 'case-resolution') content.elements = content.elements.concat(caseResolutionFooter);
		output += formFormat(_.assign({ name: formName }, content)) + ';';
	} else if(fileName == 'rules.js') {
		output += rulesFormat(content) + ';';
	} else {
		output+= formFormat(content) + ';';
	}
	file.write(output, 'utf8', function(err, data) {
		if(err) console.error(err);
		file.end();
	});
}