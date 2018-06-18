var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var pluralize = require('pluralize');
var configGen = require('./config-generators.js');
var entityName = process.argv[2] ? process.argv[2] : 'case';
var isCustom = process.argv[3] === 'custom';

// Run
if(isCustom) {
	var customFormPaths = {
		'acl.js': path.join('entities', entityName),
		'entity-details-tmpl.dust': 'public/templates/custom-forms',
		'entity-tmpl.dust': 'public/templates/custom-forms',
		'entity-view.js': 'public/views/custom-forms',
		'new-entity-tmpl.dust': 'public/templates/custom-forms'
	};

	fs.readdir(configGen.customFormsDir, function(err, files) {
		if(err) console.error(err);
		_.forEach(files, function(file) {
			fs.readFile(path.join(configGen.customFormsDir, file), 'utf8', function (err, data) {
				if (err) console.error(err);
				writeToFile(file.replace('entity', entityName), replaceEntityName(data), customFormPaths[file]);
			});
		});
	});
}

fs.readFile(path.join(configGen.inDir, 'fields.txt'), 'utf8', function (err, data) {
	if (err) console.error(err);
	var input = _.map(data.split('\n'), function (item) {
		return item.split('\t');
	});
	writeToFile('index.js', generateIndex(input), path.join('entities', entityName));
});

// Variables
var fieldsDefaults = _.cloneDeep(require('./defaults/fields-defaults.js'));
var picklistDefaults = require('./defaults/options.picklists.js');
var indexHeader = fieldsDefaults.indexHeader(entityName);
var picklistOptions = {};

// Functions
function generateIndex(data) {
	var fields = generateFields(data);
	var index;

	if(isCustom) {
		indexHeader = fieldsDefaults.customHeader;
		index = fieldsDefaults.defaultCustomOptions(entityName);
		index.fields = fields;
		writeToFile('sys_' + entityName + '.js', generateCustomController(), path.join('config', 'custom-forms'));
		writeToFile(entityName + '-model.js', generateModel(), path.join('public', 'models'));
		writeToFile('grids.js', generateGrids(), path.join('entities', entityName));
	} else {
		if(entityName === 'case') {
			fields = _.concat(fieldsDefaults.defaultCaseFields, fields,
				fieldsDefaults.defaultResolutionFields);
		};
		index = { fields: fields };
		addDefaultGrids();
	}

	_.defaults(index, fieldsDefaults.indexFooter);
	writeToFile('options.picklists.js', _.defaults(picklistOptions, picklistDefaults), 'config');
	return index;
}

function generateFields(listOfLists) {
	return _.map(listOfLists, function (list) {
		var fieldtype = correctTypeName(list[1]);
		if(!fieldtype) throw 'input contains an invalid type: ' + list[1];

		var field = {
			field: _.camelCase(list[0]),
			type: fieldtype,
			caption: list[0].trim().replace(/'/g, '\"')
		};

		if(_.includes(fieldtype, 'picklist')) {
			var term = list[0].trim();
			var picklistName = _.snakeCase(term) === 'actions_taken' ?
				_.snakeCase(term) : pluralize(_.snakeCase(term));
			var picklistDependencies;

			if(list[2] && list[2].charAt(0) === '#') {
				picklistDependencies = list[2].slice(1).split(',');
				picklistDependencies = _.map(picklistDependencies, function(item) {
					return _.camelCase(item);
				});
				list[2] = null;
			}

			var picklistData;
			if(configGen.generateBlankLists) {
				picklistData = list[2] || _.map(new Array(3), function(item, key) {
					return pluralize.singular(_.startCase(picklistName)) + ' ' + (key + 1);
				}).join(',');
			} else {
				picklistData = list[2];
			}

			field.typeOptions = { picklistName: picklistName };
			if(picklistDependencies) field.typeOptions['picklistDependencies'] = picklistDependencies;

			if(picklistData) writeToFile(picklistName + '.json', generatePicklist(picklistName, picklistData), path.join('data', 'lists'));
			addOptions(picklistName, picklistDependencies);
		} else if(fieldtype === 'radio') {
			if(list[2] && !isYesNo(list[2])) {
				field.typeOptions = generateRadios(list[2]);
			} else {
				field.type = 'yesno';
			}
		}

		field.kind = 'editable';
		return field;
	});
}

function correctTypeName(type) {
	type = type.toLowerCase().trim();
	if(_.includes(type, 'drop') || type === 'picklist') return 'picklist';
	if(_.includes(type, 'multi') || type === 'picklist[]') return 'picklist[]';
	if(_.includes(type, 'editor') || _.includes(type, 'area')) return 'texteditor';
	if(_.includes(type, 'box') || _.includes(type, 'text')) return 'textbox';
	if(_.includes(type, 'date') && _.includes(type, 'time')) return 'datetime';
	if(_.includes(type, 'date')) return 'date';
	if(_.includes(type, 'radio')) return 'radio';
	if(_.includes(type, 'check')) return 'checkbox';
	if(_.includes(type, 'user')) return 'user';
	if(_.includes(type, 'phone')) return 'phoneNumber';
	if(_.includes(type, 'number')) return 'number';
}

function generatePicklist(listName, list) {
	return _.map(list.split(','), function(item) {
		return {
			name: listName,
			value: _.snakeCase(item),
			caption: item.trim()
		};
	});
}

function generateRadios(radios) {
	return {
		radios: _.map(radios.split(','), function (item) {
			return { value: _.snakeCase(item), caption: _.snakeCase(item) };
		}),
		orientation: 'horizontal'
	};
}

function generateCustomController() {
	return {
		formName: entityName,
		entity: {
			base: 'sys',
			name: entityName
		},
		view: entityName + '-view.js',
		model: entityName + '-model.js',
		gridName: 'main-' + entityName,
		caseGridName: 'case-' + entityName
	};
}

function generateGrids() {
	var gridObj = {};
	gridObj['main-' + entityName] = {
		sortColumn: 'childNumber',
		sortOrder: 'desc',
		columns: [
			{ field: 'childNumber' },
			{ field: 'createdDate' }
		]
	};
	gridObj['case-' + entityName] = {
		sortColumn: 'number',
		sortOrder: 'desc',
		columns: [
			{ field: 'number' },
			{ field: 'createdDate' }
		]
	};
	return gridObj;
}

function generateModel() {
	return {
		urlRoot: '$appData.globalConfig.apiRoot + ' + '\'/' + entityName + '\'',
		entity: {
			base: 'sys',
			name: entityName
		},
		idAttribute: 'id'
	};
}

function addOptions(option, parents) {
	if(parents) {
		parents = _.map(parents, function(item) {
			return pluralize(_.snakeCase(item));
		});
	}

	picklistOptions[option] = {
		text: 'value',
		value: 'value',
		parents: parents
	};
}

function addDefaultGrids() {
	if(entityName === 'case') {
		fs.readFile(path.join(configGen.defDir, 'grids.js'), 'utf8', function (err, data) {
			if (err) console.error(err);
			writeToFile('grids.js', data, path.join('entities', entityName));
		});
	} else if(entityName === 'party') {
		fs.readFile(path.join(configGen.defDir, 'grids-party.js'), 'utf8', function (err, data) {
			if (err) console.error(err);
			writeToFile('grids.js', data, path.join('entities', entityName));
		});
	}
}

function isYesNo(radios) {
	var radioArray = radios.split(',');
	var result = true;
	if(radioArray.length > 2) result = false;
	_.forEach(radioArray, function(radio) {
		if(radio.toLowerCase() !== 'yes' && radio.trim().toLowerCase() !== 'no') result = false;
	});
	return result;
}

function indexFormat(data) {
	return JSON.stringify(data, null, '\t')
		.replace(/\"([^(\")"]+)\":/g,"$1:")
		.replace(/"/g, "'")
		.replace(/'require\(/g, "require(")
		.replace(/.js'\)'/g, ".js')");
}

function optionsFormat(data) {
	return JSON.stringify(data, null, '\t')
		.replace(/\"([^(\")"]+)\": {/g, "\'$1\': {")
		.replace(/\"([^(\")"]+)\":/g,"$1:")
		.replace(/"/g, "'");
}

function moduleFormat(data) {
	return JSON.stringify(data, null, '\t')
		.replace(/\"([^(\")"]+)\":/g,"$1:")
		.replace(/"/g, "'");
}

function modelFormat(data) {
	return JSON.stringify(data, null, '\t')
		.replace(/\"([^(\")"]+)\":/g,"$1:")
		.replace(/"/g, "'")
		.replace(/urlRoot: \'([^(\")"]+)\'\',/,"urlRoot: $1',");
}

function replaceEntityName(data) {
	return data
		.replace(/entity/g, entityName)
		.replace(/Entity/g, capitalize(entityName))
		.replace(/entities/g, pluralize(entityName))
		.replace(/Entities/g, pluralize(capitalize(entityName)));
}

function capitalize(data) {
	var words = data.split(' ');
	var capitalized = _.map(words, function(word) {
		return word.charAt(0).toUpperCase() + word.slice(1);
	});
	return capitalized.toString().replace(/,/g, ' ');
}

function writeToFile(fileName, content, filepath) {
	var baseDir = configGen.pathOn ? configGen.projDir : configGen.outDir;
	createFolderPath(filepath, baseDir);

	var file;
	if(entityName !== 'case' && fileName === 'options.picklists.js' && configGen.pathOn) {
		file = fs.createWriteStream(path.join(configGen.outDir, fileName));
	} else {
		file = fs.createWriteStream(path.join(baseDir, filepath, fileName));
	}

	var output;
	if(fileName === 'index.js') {
		output = indexHeader + indexFormat(content) + ');';
	} else if(fileName === 'options.picklists.js' || (isCustom && fileName === 'grids.js')) {
		output = 'module.exports = ' + optionsFormat(content) + ';';
	} else if(_.includes(fileName, 'sys_')) {
		output = 'module.exports = ' + moduleFormat(content) + ';';
	} else if(_.includes(fileName, 'model.js')) {
		output = fieldsDefaults.modelHeader + modelFormat(content) + ');';
	} else if(_.includes(fileName, '.json')) {
		output = JSON.stringify(content, null, '\t');
	} else {
		output = content;
	}
	file.write(output, 'utf8', function(err, data) {
		if(err) console.error(err);
		file.end();
	});
}

function createFolderPath(targetPath, baseDir) {
	var folders = _.filter(targetPath.split(path.sep), function(item) {
		return !_.includes(item, '.');
	});

	_.reduce(folders, function(newPath, item) {
		newPath = path.join(newPath, item);
		if(!fs.existsSync(newPath)) { fs.mkdirSync(newPath); }
		return newPath;
	}, baseDir);
}