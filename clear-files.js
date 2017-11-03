var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var outDir = './output/';

fs.readdir(outDir, function(err, files) {
	if(err) console.error(err);
	_.forEach(files, function(file) {
		fs.unlink(path.join(outDir, file), function(err) {
			if(err) console.error(err);
		});
	});
});