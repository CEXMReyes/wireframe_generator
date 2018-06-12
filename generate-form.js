var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var inDir = './input/';
var outDir = './output/';
// var outDir = '/Users/mreyes/git/config_montana_v5';
var customDir = './custom-tabs/';
var formName = process.argv[2] ? process.argv[2] : 'case-capture';
var entityName = (_.split(formName, '-'))[0];
var isTab = process.argv[3] === 'tab';
var pathOn = true;

// Run
if(isTab) {
	fs.readdir(customDir, function(err, files) {
		if(err) console.error(err);
		_.forEach(files, function(file) {
			fs.readFile(path.join(customDir, file), 'utf8', function (err, data) {
				if (err) console.error(err);
				writeToFile(file.replace('tab-name', formName), replaceTabName(data));
			});
		});
	});
}

fs.readFile(path.join(inDir, 'form.txt'), 'utf8', function (err, data) {
	if (err) console.error(err);
	var input =  _.map(data.split('\n'), function (item) {
		return item.split('\t');
	});
	writeToFile(formName + '-form.js', generateForm(input), path.join('config', 'form-layouts'));
	writeToFile('rules.js', rules, path.join('entities', entityName));
	writeToFile('validation.js', validation, path.join('entities', entityName));
});

// Variables
var formDefaults = _.cloneDeep(require('./defaults/form-defaults.js'));
var validation = { mandatory$: [], dependentMandatory$: [] };
var rules = {};

// Functions
function generateForm(listOfLists) {
	if(_.includes(formName, 'case')) addValidation('closeReason', 'isClosed');
	if(!_.includes(formName, 'case')) addValidation('caseId', '*');
	var section;
	var isSection = false;
	var output = _.reduce(listOfLists, function (acc, list) {
		if(_.includes(list[0], '###')) {
			section = { type: 'section' };
			section.caption = _.snakeCase(list[0].split('###'));
			section.elements = [];
			isSection = true;
			return acc;
		}
		if(_.includes(list[0], '##')) {
			isSection = false;
			acc.push(section);
			return acc;
		}

		var field = { field: _.camelCase(list[0]) };
		var rule = '';
		var multiRules = [];

		if(list[1]) {
			if(_.includes(list[1], '||')) {
				multiRules = _.map(list[1].split('||'), function(item) {
					return generateRules(item);
				});
				rule = multiRules.toString().replace(/,/g, ' || ');
				addValidation(field.field, rule);
			} else {
				rule = list[1].trim() === '*' ? '*' : generateRules(list[1]);
				addValidation(field.field, rule);
			}
		}
		if(list[2]) {
			if(_.includes(list[2], '||')) {
				multiRules = _.map(list[2].split('||'), function(item) {
					return generateRules(item);
				});
				field.displayRule = multiRules.toString().replace(/,/g, ' || ');
			} else {
				field.displayRule = generateRules(list[2]);
			}
		}
		if(isSection) {
			section.elements.push(field);
		} else {
			acc.push(field);
		}

		return acc;
	}, []);

	if(formName === 'case-overview') {
		output = formDefaults.caseOverviewHeader.concat(output);
	} else if(!_.includes(formName, 'case')) {
		output = formDefaults.childHeader.concat(output);
		if(formName === 'party-details') output[0].typeOptions = formDefaults.partyTypeOptions;
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
		.replace(/function_header_truthy/g, "return !!data.")
		.replace(/function_header/g, "return data.")
		.replace(/"/g, "")
		.replace(/data.: /g, "data.");
}

function formFormat(data) {
	return JSON.stringify(data, null, '\t')
		.replace(/\"([^(\")"]+)\":/g,"$1:")
		.replace(/"/g, "'");
}

function replaceTabName(data) {
	var halfName = formName.replace(/case-/g, '');
	return data
	.replace(/tab-name/g, formName)
	.replace(/tabName/g, _.camelCase(formName))
	.replace(/tab_name/g, _.snakeCase(formName))
	.replace(/TabName/g, _.upperFirst(_.camelCase(formName)))
	.replace(/half-name/g, halfName)
	.replace(/halfName/g, _.camelCase(halfName))
	.replace(/half_name/g, _.snakeCase(halfName))
	.replace(/HalfName/g, _.upperFirst(_.camelCase(halfName)));
}

function writeToFile(fileName, content, filepath) {
	if(!pathOn) filepath = null;
	filepath = filepath || '.';
	createFolderPath(filepath);
	var file = fs.createWriteStream(path.join(outDir, filepath, fileName));
	var output = 'module.exports = ';
	if(_.includes(fileName, 'form.js')) {
		if(formName === 'case-capture') content.elements = content.elements.concat(formDefaults.caseCaptureFooter);
		if(formName === 'case-resolution') content.elements = content.elements.concat(formDefaults.caseResolutionFooter);
		output += formFormat(_.assign({ name: formName }, content)) + ';';
	} else if(fileName == 'rules.js') {
		if(_.includes(formName, 'case')) content = _.defaults(content, formDefaults.caseRulesDefaults);
		output += rulesFormat(content) + ';';
	} else if(fileName == 'validation.js') {
		output += formFormat(content) + ';';
	} else {
		output = content;
	}
	file.write(output, 'utf8', function(err, data) {
		if(err) console.error(err);
		file.end();
	});
}

function createFolderPath(targetPath) {
	var folders = _.filter(targetPath.split(path.sep), function(item) {
		return !_.includes(item, '.');
	});

	_.reduce(folders, function(newPath, item) {
		newPath = path.join(newPath, item);
		if(!fs.existsSync(newPath)) { fs.mkdirSync(newPath); }
		return newPath;
	}, outDir);
}