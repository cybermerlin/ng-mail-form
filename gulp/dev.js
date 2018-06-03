const path = require('path'),
    gulp = require('gulp'),
    conf = require('./conf'),
    changeRootDir = '/static/',
    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'del']
    });

gulp.task('devhtml', ['inject', 'partials'], function() {
  const htmlFilter = $.filter('*.html', {restore: true}),
      jsFilter = $.filter('**/*.js', {restore: true}),
      cssFilter = $.filter('**/*.css', {restore: true}),
      assets = $.useref.assets();

  let result = gulp
      .src(path.join(conf.paths.tmp, '/serve/*.html'))
      .pipe(assets)
      .pipe($.rev())
      .pipe(jsFilter)
      .pipe($.ngAnnotate())
      .pipe(jsFilter.restore)
      .pipe(cssFilter)
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

  if ( changeRootDir )
    result = result
        .pipe($.replace(/(assets\/)|(\.\.\/assets\/)/g, '/static/assets/'))
        .pipe($.replace(/"img\//g, '"/static/assets/img/'))
        .pipe($.replace(/href="styles\//g, 'href="/static/styles/'))
        .pipe($.replace(/src="scripts\//g, 'src="/static/scripts/'))
        .pipe($.replace(/\.\.\/fonts\//g, "/static/fonts/"))
        .pipe($.replace(/\/static\/assets\/fonts\//g, '/static/fonts/'))
        .pipe($.replace(/\(fonts\//g, '(/static/fonts/'))
        .pipe($.replace(/'fonts\//g, "'/static/fonts/"))
    ;
  else
    result = result
        .pipe($.replace(/\.\.\/fonts\//g, "/fonts/"))
        .pipe($.replace(/\/static\/assets\/fonts\//g, '/fonts/'))
        .pipe($.replace(/\(fonts\//g, '(/fonts/'))
        .pipe($.replace(/'fonts\//g, "'/fonts/"))
    ;

  result = result
      .pipe(gulp.dest(path.join(conf.paths.devDist, '/')))
      .pipe($.size({title: path.join(conf.paths.devDist, '/'), showFiles: true}));

  return result;
});

gulp.task('dev', ['devhtml', 'fonts', 'other']);
