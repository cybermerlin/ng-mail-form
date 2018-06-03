const path = require('path'),
    gulp = require('gulp'),
    conf = require('./conf'),

    browserSync = require('browser-sync'),
    browserSyncSpa = require('browser-sync-spa'),

    util = require('util'),

    proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  let routes = null;
  if ( baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1) ) {
    routes = {};
  }

  const server = {
    baseDir: baseDir,
    routes: routes
  };

  server.middleware = proxyMiddleware('/v1', {target: 'http://localhost:443', ws: true});

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser,
    ghostMode: false
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('server', ['watch'], function() {
  browserSyncInit([path.join(conf.paths.tmp, '/partials'), path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
});

gulp.task('server:dist', ['build'], function() {
  browserSyncInit(conf.paths.dist);
});
