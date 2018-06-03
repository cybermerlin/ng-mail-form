const path = require('path'),
    gulp = require('gulp'),
    conf = require('./conf'),
    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'uglify', 'del']
    });

gulp.task('build.demo', ['inject', 'partials', 'fonts', 'other'], function() {
  const partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), {read: false});
  const partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  };

  const htmlFilter = $.filter('*.html', {restore: true}),
      jsFilter = $.filter('**/*.js', {restore: true}),
      cssFilter = $.filter('**/*.css', {restore: true}),
      assets = $.useref.assets();

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
      .pipe($.inject(partialsInjectFile, partialsInjectOptions))
      .pipe(assets)
      .pipe($.rev())
      .pipe(jsFilter)
      .pipe($.replace(/(\(cfg\.url = Core\.API\.siteURL \+ cfg\.url\))/,
          "(cfg.url = Core.API.siteURL + cfg.url.substring(0,cfg.url.length-1) + '.json')"))
      .pipe($.replace(/\/webcl\/api\/v1\//, 'assets/Data/'))
      .pipe($.sourcemaps.init())
      .pipe($.ngAnnotate())
      .pipe($.uglify()).on('error', conf.errorHandler('Uglify'))
      .pipe($.sourcemaps.write('maps'))
      .pipe(jsFilter.restore)
      .pipe(cssFilter)
      .pipe($.sourcemaps.init())
      .pipe($.replace(/url\(.*?fonts\//g, 'url(../fonts/'))
      .pipe($.minifyCss({processImport: false}))
      .pipe($.sourcemaps.write('maps'))
      .pipe(cssFilter.restore)
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.revReplace())
      .pipe(htmlFilter)
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true,
        conditionals: true
      }))
      .pipe(htmlFilter.restore)
      .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
      .pipe($.size({title: path.join(conf.paths.dist, '/'), showFiles: true}));
});
