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
  e2e: 'e2e',
  
  // just write npm names such u want to inject into your build packete
  node_modules: []
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
