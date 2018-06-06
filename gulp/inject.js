const path = require('path'),
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    npmfiles = require('npmfiles'),
    _ = require('lodash'),
    browserSync = require('browser-sync'),
    conf = require('./conf');


function injectAlone(options = {}) {
  const injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  let result = gulp.src(options.paths);
  if ( options.styles )
    result = result.pipe(
        $.inject(gulp.src(options.styles, {read: false}), injectOptions));
  if ( options.scripts )
    result = result.pipe(
        $.inject(
            gulp.src(options.scripts)
                .on('error', conf.errorHandler('AngularFilesort')),
            injectOptions
        ));
  if ( options.partials )
    result = result.pipe(
        $.inject(gulp.src(options.partials, {read: false}), {
          starttag: '<!-- inject:partials -->',
          ignorePath: path.join(conf.paths.tmp, '/partials'),
          addRootSlash: false
        }));
  if ( options.vendors )
    result = result.pipe(
        $.inject(gulp.src(npmfiles({nodeModulesPath: './node_modules/'})),
            {
              relative: true,
              starttag: '<!-- npm:js -->',
              ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
              addRootSlash: false
            }));

  return result
      .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
}


gulp.task('inject-reload', ['inject'], function() {
  browserSync.reload();
});

gulp.task('inject',
    ['partials', 'scripts', 'styles', 'inject404'/*, 'copyVendorImages'*/, 'copyVendorJSON'],
    function() {
      return injectAlone({
        paths: path.join(conf.paths.src, '/index.html'),
        styles: [
          path.join(conf.paths.tmp, '/serve/styles/styles.css'),
          path.join(conf.paths.tmp, '/serve/styles/main.css'),
          path.join('!' + conf.paths.tmp, '/serve/styles/vendor.css')
        ],
        scripts: [
          path.join(conf.paths.src, '/lib/**/*.{js|ts}'),
          path.join(conf.paths.src, '/**/*.static.js'),
          path.join(conf.paths.src, '/**/*.model.js'),
          path.join(conf.paths.src, '/**/*.store.js'),
          path.join(conf.paths.src, '/**/*.data.js'),
          path.join(conf.paths.src, '/index.js'),
          path.join(conf.paths.src, '/pages/**/*.module.js'),
          path.join(conf.paths.src, '/plugins/**/*.js'),
          path.join(conf.paths.src, '/pages/**/*.js')
        ],
        partials: [
          path.join(conf.paths.tmp, '/partials/templateCacheHtml.js')
        ]
      });
    }
);

gulp.task('inject404', ['styles404'], function() {
  return injectAlone({
    styles: [
      path.join('!' + conf.paths.tmp, '/serve/styles/vendor.css'),
      path.join(conf.paths.tmp, '/serve/styles/404.css')
    ],
    paths: path.join(conf.paths.src, '/404.html')
  });
});
