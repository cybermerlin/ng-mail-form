const path = require('path'),
    gulp = require('gulp'),
    conf = require('./conf'),

    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'uglify-save-license', 'del']
    });

gulp.task('fonts', function() {
  return gulp
      .src([
        path.join(conf.paths.src, '/assets/fonts/*'),
        path.join(conf.paths.src, '/lib/**/fonts/*')
      ])
      .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
      .pipe($.flatten())
      .pipe(gulp.dest(path.join(conf.paths.tmp, 'serve', '/fonts')))
      .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')))
      .pipe(gulp.dest(path.join(conf.paths.devDist, '/fonts/')));
});
