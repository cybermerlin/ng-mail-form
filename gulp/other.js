const path = require('path'),
    gulp = require('gulp'),
    conf = require('./conf'),
    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'uglify', 'del']
    });

gulp.task('other', ['copyVendorImages', 'copyVendorJSON'], function() {
  const fileFilter = $.filter(function(file) {
    return file.stat.isFile();
  });

  return gulp.src([
        path.join('!' + conf.paths.src, '/**/*.iml'),
        path.join(conf.paths.src, '/**/*'),
        path.join('!' + conf.paths.src, '/**/fonts/*'),
        path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss,md}'),
        path.join(conf.paths.tmp, '/serve/**/assets/Data/**/*'),
        path.join(conf.paths.tmp, '/serve/**/assets/img/theme/vendor/**/*')
      ])
      .pipe(fileFilter)
      .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
      .pipe(gulp.dest(path.join(conf.paths.devDist, '/')))
      .pipe(gulp.dest(path.join(conf.paths.release, '/')));
});
