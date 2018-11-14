var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var pluralize = require('pluralize');
var Papa = require('papaparse');
var configGen = require('./config.js');

// Run
fs.readFile(path.join(configGen.inDir, 'picklists.txt'), 'utf8', function(err, data) {
	if (err) console.error(err);
	var input = _.map(data.split('\n'), function(item) {
		return item.split('\t');
	});
	generatePickLists(input);
	generateOptions(input[0]);
});

// Functions
function generatePickLists(listOfLists) {
	var listName = pluralize(_.snakeCase(listOfLists[0][listOfLists[0].length - 1].trim()));
	var hasParent = listOfLists[0].length > 1;
	var nextList = hasParent ? [listOfLists[0].slice(0, listOfLists[0].length -1)] : [];

	var output = _.reduce(listOfLists.slice(1), function(acc, list) {
		var nextItem = list;
		if(listOfLists[0].length === list.length) {
			nextItem = list.slice(0, list.length - 1);
			var listOfItems = hasParent ? Papa.parse(list[list.length -1],
				{ delimiter: ',' }).data[0] : [list[list.length - 1]];

			_.forEach(listOfItems, function(item) {
				var listItem = {
					name: listName,
					value: item.trim()
				};
				if(hasParent) {
					listItem.parents = _.map(nextItem, function(parentItem) {
						return parentItem.trim();
					});
				}
				acc.push(listItem);
			});
		}
		if(hasParent && shouldStoreNext(nextList, nextItem)) nextList.push(nextItem);
		return acc;
	}, []);

	writeToFile(listName + '.json', output);
	if(hasParent) generatePickLists(nextList);
}

function generateOptions(options) {
	var listNames = _.map(options, function(item) {
		return pluralize(_.snakeCase(item.trim()));
	});

	var output = _.reduce(listNames, function(acc, item, key) {
		acc[item] = {
			text: 'value',
			value: 'value'
		}
		if(key > 0) acc[item].parents = listNames.slice(0, key);
		return acc;
	}, {});

	writeToFile('options.picklists.js', output);
}

function shouldStoreNext(collection, nextItem) {
	var result = true;
	_.forEach(collection, function(item) {
		if(arrayEquals(item, nextItem)) return result = false;
	});
	return result;
}

function arrayEquals(a, b) {
	if(a.length !== b.length) return false;
	return _.every(a, function(value, key) {
		return value.trim() === b[key].trim();
	});
}

function picklistFormat(data) {
	return JSON.stringify(data, null, '\t')
		.replace(/\n\t\t\t/g, '')
		.replace(/\n\t\t\]/g, ']')
		.replace(/,"/g, ', "');
}

function optionsFormat(data) {
	return JSON.stringify(data, null, '\t')
		.replace(/\"([^(\")"]+)\": {/g, "\'$1\': {")
		.replace(/\"([^(\")"]+)\":/g,"$1:")
		.replace(/"/g, "'");
}

function writeToFile(fileName, content) {
	var file = fs.createWriteStream(path.join(configGen.outDir, fileName));
	var output;
	if(_.includes(fileName, '.json')) {
		output = picklistFormat(content);
	} else {
		output = 'module.exports = ' + optionsFormat(content);
	}
	file.write(output, 'utf8', function(err, data) {
		if(err) console.error(err);
		file.end();
	});
}