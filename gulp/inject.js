const path = require('path'),
    gulp = require('gulp'),
    conf = require('./conf'),

    $ = require('gulp-load-plugins')(),

    wiredep = require('wiredep').stream,
    _ = require('lodash'),

    browserSync = require('browser-sync');


function injectAlone(options) {
  const injectStyles = gulp.src(options.css, {read: false});

  const injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(options.paths)
      .pipe($.inject(injectStyles, injectOptions))
      .pipe(wiredep(_.extend({}, conf.wiredep)))
      .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
}


gulp.task('inject-reload', ['inject'], function() {
  browserSync.reload();
});

gulp.task('inject',
    ['partials', 'scripts', 'styles', 'inject404', 'copyVendorImages', 'copyVendorJSON'],
    function() {
      const injectStyles = gulp.src([
            path.join(conf.paths.tmp, '/serve/styles/styles.css'),
            path.join(conf.paths.tmp, '/serve/styles/main.css'),
            path.join('!' + conf.paths.tmp, '/serve/styles/vendor.css')
          ], {read: false}),

          injectScripts = gulp.src([
                path.join(conf.paths.src, '/lib/**/*.{js|ts}'),
                path.join(conf.paths.src, '/**/*.static.js'),
                path.join(conf.paths.src, '/**/*.model.js'),
                path.join(conf.paths.src, '/**/*.store.js'),
                path.join(conf.paths.src, '/**/*.data.js'),
                path.join(conf.paths.src, '/index.js'),
                path.join(conf.paths.src, '/pages/**/*.module.js'),
                path.join(conf.paths.src, '/plugins/**/*.js'),
                path.join(conf.paths.src, '/pages/**/*.js')
              ])
              .on('error', conf.errorHandler('AngularFilesort')),

          injectOptions = {
            ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
            addRootSlash: false
          },
          partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), {read: false}),
          partialsInjectOptions = {
            starttag: '<!-- inject:partials -->',
            ignorePath: path.join(conf.paths.tmp, '/partials'),
            addRootSlash: false
          };

      return gulp.src(path.join(conf.paths.src, '/index.html'))
          .pipe($.inject(injectStyles, injectOptions))
          .pipe($.inject(injectScripts, injectOptions))
          .pipe($.inject(partialsInjectFile, partialsInjectOptions))
          .pipe(wiredep(_.extend({}, conf.wiredep)))
          .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
    });

gulp.task('inject404', ['styles404'], function() {
  return injectAlone({
    css: [
      path.join('!' + conf.paths.tmp, '/serve/styles/vendor.css'),
      path.join(conf.paths.tmp, '/serve/styles/404.css')
    ],
    paths: path.join(conf.paths.src, '/404.html')
  });
});
