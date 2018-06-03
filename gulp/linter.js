require('jshint-stylish');

const
    jshint = require('gulp-jshint'),
    path = require('path'),
    gulp = require('gulp'),
    tslint = require('gulp-tslint'),
    conf = require('./conf');


gulp.task("lint.ts", function() {
  return gulp.src(path.join(conf.paths.src, '/**/*.ts'))
      .pipe(tslint({
        formatter: "verbose"
      }))
      .pipe(tslint.report());
});

gulp.task('lint.js', function() {
  return gulp.src([
        path.join(conf.paths.src, '/**/*.js')
      ])
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('linter', ['lint.js', 'lint.ts']);
