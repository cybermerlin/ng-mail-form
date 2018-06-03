const path = require('path'),
    gulp = require('gulp'),
    conf = require('./conf'),

    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*']
    }),

    browserSync = require('browser-sync');

function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', ['inject', 'fonts'], function() {
  gulp.watch([path.join(conf.paths.src, '/**/*.html')], ['inject-reload']);

  gulp.watch([
        path.join(conf.paths.src, '/css/**/*'),
        path.join(conf.paths.src, '/lib/**/*.css'),
        path.join(conf.paths.src, '/sass/**/*.css'),
        path.join(conf.paths.src, '/sass/**/*.scss')
      ],
      function(event) {
        if ( isOnlyChange(event) ) {
          gulp.start('styles-reload');
        } else {
          gulp.start('inject-reload');
        }
      });

  gulp.watch([
        path.join(conf.paths.src, '/lib/**/*.{js|ts}'),
        path.join(conf.paths.src, '/**/*.{js|ts}')
      ],
      function(event) {
        if ( isOnlyChange(event) ) {
          gulp.start('scripts-reload');
        } else {
          gulp.start('inject-reload');
        }
      });

  gulp.watch(path.join(conf.paths.src, '/**/*.html'), function(event) {
    browserSync.reload(event.path);
  });
});
