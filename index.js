const fs = require('fs');
const browserify = require('browserify');
const watchify = require('watchify');
const errorify = require('errorify');

const b = browserify({
		entries: [ './src/index.js' ],
		cache: {},
		packageCache: {},
		plugin: [ watchify, errorify ]
	})
	.transform('babelify', {
		presets: [ 'es2015', 'react' ]
	});

b.on('update', bundle);
b.on('log', console.log);
b.on('error', console.error);
bundle();

function bundle() {
	b.bundle().pipe(fs.createWriteStream('./static/js/bundle.js'));
}
