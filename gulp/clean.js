const
    path = require('path'),
    gulp = require('gulp'),
    conf = require('./conf'),

    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'del']
    });


function cleanRelease() {
  console.info('cleanRelease started');
  return $.del([
    path.join(conf.paths.devDist, '/')
  ]);
}

function cleanBuild() {
  console.info('cleanBuild started');
  return $.del([
    path.join(conf.paths.dist, '/')
  ]);
}

function cleanServe() {
  console.info('cleanServe started');
  return $.del([
    path.join(conf.paths.tmp, '/')
  ]);
}


gulp.task('cleanRelease', cleanRelease);
gulp.task('cleanBuild', cleanBuild);
gulp.task('cleanServe', cleanServe);

gulp.task('clean', ['cleanRelease', 'cleanBuild', 'cleanServe']);
