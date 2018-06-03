const path = require('path'),
    gulp = require('gulp'),
    conf = require('./conf'),
    concat = require('gulp-concat'),
    merge = require('merge-stream'),

    browserSync = require('browser-sync'),

    $ = require('gulp-load-plugins')(),

    wiredep = require('wiredep').stream,
    _ = require('lodash');

function buildSCSS() {
  const sassOptions = {
    style: 'expanded'
  };

  const injectFiles = gulp.src([
    path.join(conf.paths.src, '/sass/**/_*.scss'),
    '!' + path.join(conf.paths.src, '/sass/theme/conf/**/*.scss'),
    '!' + path.join(conf.paths.src, '/sass/404.scss')
  ], {read: false});

  const injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(conf.paths.src + '/sass/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  return gulp
      .src([
        path.join(conf.paths.src, '/sass/main.scss')
      ])
      .pipe($.inject(injectFiles, injectOptions))
      .pipe(wiredep(_.extend({}, conf.wiredep)))
      .pipe($.sourcemaps.init())
      .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
      .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/styles/')));
}

function buildSingleSCSS(paths) {
  const sassOptions = {
    style: 'expanded'
  };

  return gulp.src([paths])
      .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
      .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
      .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/styles/')));
}


gulp.task('styles-reload', ['styles'], function() {
  return buildSCSS()
      .pipe(browserSync.stream());
});

gulp.task('styles', function() {
  return merge(
      gulp
          .src([
            path.join(conf.paths.src, '/css/*'),
            path.join(conf.paths.src, '/lib/**/*.css')
          ])
          .pipe($.sourcemaps.init())
          .pipe($.replace(/fonts\//g, '../fonts/'))
          .pipe($.minifyCss({processImport: false}))
          .pipe($.sourcemaps.write())
          .pipe(concat('styles.css'))
          .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/styles/'))),
      buildSCSS());
});

gulp.task('stylesAuth', function() {
  return buildSingleSCSS(path.join(conf.paths.src, '/sass/theme/components/_auth.scss'));
});

gulp.task('styles404', function() {
  return buildSingleSCSS(path.join(conf.paths.src, '/sass/404.scss'));
});
