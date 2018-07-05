var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var configGen = require('./config-generators.js');

fs.readdir(configGen.outDir, function(err, files) {
	if(err) console.error(err);
	_.forEach(files, function(file) {
		if(fs.lstatSync(path.join(configGen.outDir, file)).isDirectory()) {
			rimraf(path.join(configGen.outDir, file), function(err) { if(err) console.error(err); });
		} else {
			fs.unlink(path.join(configGen.outDir, file), function(err) { if(err) console.error(err); });
		}
	});
});