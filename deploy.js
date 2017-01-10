const fs = require('fs');
const browserify = require('browserify');
const errorify = require('errorify');
const uglifyify = require('uglifyify');

const b = browserify({
		entries: [ './src/index.js' ],
		cache: {},
		packageCache: {},
		plugin: [ errorify ]
	})
	.transform('babelify', {
		presets: [ 'es2015', 'react' ]
	})
	.transform({
		global: true
	}, 'uglifyify');

b.on('update', bundle);
b.on('log', console.log);
b.on('error', console.error);
bundle();

function bundle() {
	b.bundle().pipe(fs.createWriteStream('./static/js/bundle.js'));
}
