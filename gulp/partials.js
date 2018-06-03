const
    path = require('path'),
    gulp = require('gulp'),
    conf = require('./conf'),

    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'uglify', 'del']
    });

gulp.task('partials', function() {
  return gulp.src([
        path.join(conf.paths.src, '/app/**/*.html'),
        path.join(conf.paths.tmp, '/serve/**/*.html')
      ])
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe($.angularTemplatecache('templateCacheHtml.js', {
        module: 'Core',
        root: 'src'
      }))
      .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});
