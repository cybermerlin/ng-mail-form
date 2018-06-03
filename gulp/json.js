const path = require('path'),
    gulp = require('gulp'),
    conf = require('./conf');

gulp.task('copyVendorJSON', function() {
  return gulp
      .src([
        path.join(conf.paths.src, '/assets/Data/**/*')
      ])
      .pipe(gulp.dest(path.join(conf.paths.tmp, 'serve', '/assets/Data')));
});

