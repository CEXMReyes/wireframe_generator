var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var pluralize = require('pluralize');
var configGen = require('./config.js');
var filterField = process.argv[2] ? process.argv[2] : 'Case Type';

fs.readdir(configGen.customFilterFieldDir, function(err, files) {
	if(err) console.error(err);
	_.forEach(files, function(file) {
		fs.readFile(path.join(configGen.customFilterFieldDir, file), 'utf8', function (err, data) {
			if (err) console.error(err);
			var filepath = '.';
			if(_.includes(file, 'acl') || _.includes(file, 'grids')) filepath = path.join('entities', 'case');
			if(_.includes(file, 'tombstone')) filepath = path.join('public', 'config');
			if(_.includes(file, 'form')) filepath = path.join('config', 'form-layouts');
			if(_.includes(file, 'view')) filepath = path.join('public', 'views', 'settings', 'case-notification');
			if(_.includes(file, 'hack')) filepath = path.join('public', 'lib');
			if(_.includes(file, 'picklist')) filepath = path.join('public', 'views', 'settings');
			if(_.includes(file, 'model')) filepath = path.join('public', 'models');
			if(_.includes(file, 'index')) {
				if(_.includes(file, 'user')) filepath = path.join('entities', 'user');
				if(_.includes(file, 'case-field')) filepath = path.join('field-types', 'case');
				file = 'index.js';
			}
			writeToFile(file, replaceFilterFieldName(data), filepath);
		});
	});
});

function replaceFilterFieldName(data) {
	return data
		.replace(/Filter Field/g, _.startCase(filterField))
		.replace(/filter field/g, _.startCase(filterField).toLowerCase())
		.replace(/filterField/g, _.camelCase(filterField))
		.replace(/filterFieldName/g, _.camelCase(filterField + 'Name'))
		.replace(/filter_field/g, _.snakeCase(filterField))
		.replace(/filter_fields/g, _.snakeCase(pluralize(filterField)))
		.replace(/userFilterFields/g, _.camelCase('user ' + filterField));
}

function writeToFile(fileName, content, filepath) {
	var baseDir = configGen.pathOn ? configGen.projDir : configGen.outDir;
	createFolderPath(filepath, baseDir);

	var file;
	if(fileName === 'webpack.overrides.js' && configGen.pathOn) {
		file = fs.createWriteStream(path.join(configGen.outDir, fileName));
	} else {
		file = fs.createWriteStream(path.join(baseDir, filepath, fileName));
	}

	file.write(content, 'utf8', function(err, data) {
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