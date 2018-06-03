/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */
const gutil = require('gulp-util');

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
	srvRootDir: '/mailform/',
  buildSrvRootDir: '',

  src: 'src',
  dist: 'build',
  release: 'build/release',
  devDist: 'build/dev-release',
	docs: 'docs',
  tmp: '.tmp',
  tmpTS: '.tmp/ts',
  e2e: 'e2e'
};

/**
 *  Wiredep is the lib which inject  dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
  exclude: [/\/bootstrap\.js$/, /\/bootstrap-sass\/.*\.js/, /\/require\.js/],
  directory: 'node_modules'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
