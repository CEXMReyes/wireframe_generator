var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var Papa = require('papaparse');
var configGen = require('./config.js');

/*

	Example Commands:

	node sort-spec run case-overview filter caseType


*/

fs.readFile(path.join(configGen.inDir, 'spec.txt'), 'utf8', function (err, data) {
	if (err) console.error(err);
	sortColumns(data);

	var formType = process.argv[2] || null;
	var entityType = formType ? (formType.split('-').slice(0,-1).join('-')) : null;

	process.argv[2] = entityType;
	require('./generate-fields.js');

	process.argv[2] = formType;
	require('./generate-form.js');

	if(process.argv[3] === 'filter') {
		process.argv[2] = process.argv[4];
		require('./generate-filter-field.js');
	}
});

function sortColumns(data) {
	var rows = Papa.parse(data.trim(), { delimiter: '\t' }).data;
	var fields = [];
	var form = [];

	_.forEach(rows, function(row) {
		// console.log(row);
		if(_.includes(row[0], '##')) {
			form.push(_.trim(row[0]));
		} else {
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
		}
	});

	writeToFile(fields.join('\n'), 'fields.txt');
	writeToFile(form.join('\n'), 'form.txt');
}


function writeToFile(content, fileName) {
	var file = fs.createWriteStream(path.join(configGen.inDir, fileName));
	file.write(content, 'utf8', function(err) {
		if(err) console.error(err);
		file.end();
	});
}