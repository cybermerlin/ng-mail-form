const path = require('path'),
    gulp = require('gulp'),
    conf = require('./conf'),
    changeRootDir = '/static/',

    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'uglify-save-license', 'del']
    });

gulp.task('releasehtml', ['inject', 'partials'], function() {
  const htmlFilter = $.filter('*.html', {restore: true}),
      jsFilter = $.filter('**/*.js', {restore: true}),
      cssFilter = $.filter('**/*.css', {restore: true}),
      assets = $.useref.assets();

  let result = gulp
      .src(path.join(conf.paths.tmp, '/serve/*.html'))
      .pipe(assets)
      .pipe($.rev())
      .pipe(jsFilter)
      .pipe($.sourcemaps.init())
      .pipe($.ngAnnotate())
      .pipe($.uglify({preserveComments: $.uglifySaveLicense})).on('error', conf.errorHandler('Uglify'))
      .pipe($.sourcemaps.write('maps'))
      .pipe(jsFilter.restore)
      .pipe(cssFilter)
      .pipe($.sourcemaps.init())
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
      .pipe(htmlFilter.restore);

  if ( changeRootDir ) {
    result = result
        .pipe($.replace(/(assets\/)|(\.\.\/assets\/)/g, '/static/assets/'))
        .pipe($.replace(/"img\//g, '"/static/assets/img/'))
        .pipe($.replace(/href="styles\//g, 'href="/static/styles/'))
        .pipe($.replace(/src="scripts\//g, 'src="/static/scripts/'))
        .pipe($.replace(/url\((\.\.\/)?(assets\/)?fonts\//g, 'url(/static/fonts/'));
  } else {
    result = result
        .pipe($.replace(/siteURL: '.*',$/g, "Core.API.siteURL: '',"))
        .pipe($.replace(/siteURL \+ cfg\.url;/g,
            "siteURL + cfg.url.substring(0,cfg.url.length-1) + .json;"));
  }

  result = result
      .pipe(gulp.dest(path.join(conf.paths.release, '/')))
      .pipe($.size({title: path.join(conf.paths.release, '/'), showFiles: true}));

  return result;
});

gulp.task('release', ['releasehtml', 'fonts', 'other']);
