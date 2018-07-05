var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var Papa = require('papaparse');
var configGen = require('./config-generators.js');
var run = process.argv[2] === 'run';

fs.readFile(path.join(configGen.inDir, 'spec.txt'), 'utf8', function (err, data) {
	if (err) console.error(err);
	sortColumns(data);

	if(run) {
		var formType = process.argv[3] || null;
		var entityType = formType ? (formType.split('-'))[0] : null;
		process.argv[3] = process.argv[4];

		process.argv[2] = entityType;
		require('./generate-fields.js');

		process.argv[2] = formType;
		require('./generate-form.js');
	}
});

function sortColumns(data) {
	var rows = Papa.parse(data.trim(), { delimiter: '\t' }).data;
	var fields = [];
	var form = [];

	_.forEach(rows, function(row) {
		// console.log(row);
		var fieldLine = [row[0], row[1]];
		var formLine = [row[0]];

		if(row[2]) {
			formLine.push(row[2]);
		} else {
			formLine.push('');
		}

		if(row[3]) {
			formLine.push(row[3]);
		} else {
			formLine.push('');
		}

		if(row[4]) {
			fieldLine.push(row[4]);
		} else {
			fieldLine.push('');
		}

		fields.push(_.trim(fieldLine.join('\t')));
		form.push(_.trim(formLine.join('\t')));
	});

	writeToFile(fields.join('\n'), 'fields.txt');
	writeToFile(form.join('\n'), 'form.txt');
}


function writeToFile(content, fileName) {
	var file = fs.createWriteStream(path.join(configGen.inDir, fileName));
	file.write(content, 'utf8', function(err) {
		if(err) logger.error(err);
		file.end();
	});
}