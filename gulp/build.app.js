const
    path = require('path'),
    gulp = require('gulp'),
    conf = require('./conf'),
    minifyJS = require('gulp-uglify'),
    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'del']
    });


gulp.task('build.html', ['inject', 'partials'], function() {
  console.info('buildhtml started');

  const
      partialsInjectFile = gulp.src(
          path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'),
          {read: false}),
      partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: path.join(conf.paths.tmp, '/partials'),
        addRootSlash: false
      },

      htmlFilter = $.filter('*.html', {restore: true}),
      jsFilter = $.filter('**/*.js', {restore: true}),
      cssFilter = $.filter('**/*.css', {restore: true}),
      assets = $.useref.assets();

  console.log('--------', htmlFilter);
  let
      result = gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
          .pipe($.inject(partialsInjectFile, partialsInjectOptions))
          .pipe(assets)
          .pipe($.rev())
          .pipe(jsFilter)
          //// .pipe($.replace(/siteURL: '\/webcl\/api\/v1\/',$/, "siteURL: '',"))
          //.pipe($.replace(/(\(cfg\.url = siteURL \+ cfg\.url\))/,
          //		"(cfg.url = siteURL + 'assets/Data/'+cfg.url.substring(0,cfg.url.length-1) + '.json')"))
          //.pipe($.sourcemaps.init())
          .pipe($.ngAnnotate())
          .pipe(minifyJS())//.on('error', conf.errorHandler('Uglify'))
          // .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
          .pipe($.replace(/href:"\/"/, 'href:"' + conf.buildSrvRootDir + '"'))
          .pipe(jsFilter.restore)
          .pipe(cssFilter)
          //.pipe($.sourcemaps.init())
          //.pipe($.replace(/url\(.*?fonts\//g, 'url(../fonts/'))
          .pipe($.minifyCss({processImport: false}))
          //.pipe($.sourcemaps.write('maps'))
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


  if ( conf.paths.buildSrvRootDir )
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
      .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
      .pipe($.size({title: path.join(conf.paths.dist, '/'), showFiles: true}));

  return result;
});

gulp.task('build.app', ['build.html', 'fonts', 'other']);
// gulp.task('build.app', gulp.parallel('build.html', 'fonts', 'other', function(done){done();})));
