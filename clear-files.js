var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var outDir = './output/';

fs.readdir(outDir, function(err, files) {
	if(err) console.error(err);
	_.forEach(files, function(file) {
		if(fs.lstatSync(path.join(outDir, file)).isDirectory()) {
			rimraf(path.join(outDir, file), function(err) { if(err) console.error(err); });
		} else {
			fs.unlink(path.join(outDir, file), function(err) { if(err) console.error(err); });
		}
	});
});